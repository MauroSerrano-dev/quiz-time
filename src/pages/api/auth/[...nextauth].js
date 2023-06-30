import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { FirebaseAdapter } from "@next-auth/firebase-adapter"
import GoogleProvider from 'next-auth/providers/google';
import { getClientPromise } from "../../../backend-data/utils/mongodb";
import { initializeApp } from 'firebase/app'
import { createCustomer, getCustomerByEmail } from "../../../backend-data/utils/stripe";
import { getDatabase, ref, set } from 'firebase/database'
import { getFirebaseConfig } from "@/backend-data/utils/firebase";
import firebase from "firebase/app"
import "firebase/firestore"

const firebaseConfig = getFirebaseConfig()

const firestore = (
  firebase.apps[0] ?? firebase.initializeApp({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    })
).firestore()

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      profile(profile) {
        return {
          id: profile.email,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          createAt: new Date(),
          quizzesInfo: [],
          quizzes: [],
          imgsSrc: [],
          purchases: [],
          plan: { name: 'Free' },
          sketchs: [],
        }
      },
    }),
  ],
  callbacks: {
    session: async (session) => {
      return Promise.resolve({
        ...session,
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          plan: session.user.plan,
          quizzesInfo: session.user.quizzesInfo,
        }
      });
    },
    async signIn(props) {
      const { user, account, profile } = props;
      if (user && user.email) {
        try {
          const existingCustomer = await getCustomerByEmail(user.email);
          if (existingCustomer)
            return true
          await createCustomer(user.email, user.name);
          return true
        } catch (error) {
          console.error("Error creating customer:", error);
          return false
        }
      }
      return true
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  database: process.env.FIREBASE_DATABASE_URL,
  adapter: FirebaseAdapter(firestore),
});