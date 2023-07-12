/* import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import { createCustomer, getCustomerByEmail } from "../../../backend-data/utils/stripe";

import { FirestoreAdapter } from '@next-auth/firebase-adapter'
import { cert } from "firebase-admin/app";
const { v4: uuidv4 } = require('uuid');

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      profile(profile) {
        return {
          id: profile.email,
          uui: uuidv4(),
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          createAt: new Date(),
          quizzesInfos: [],
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
          uui: session.user.uui,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          plan: session.user.plan,
          quizzesInfos: session.user.quizzesInfos,
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
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    })
  }),
}); */