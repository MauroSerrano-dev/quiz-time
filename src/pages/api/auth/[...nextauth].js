import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from 'next-auth/providers/google';
import { getClientPromise } from "../../../backend-data/utils/mongodb";
import { createCustomer, getCustomerByEmail } from "../../../backend-data/utils/stripe";

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
          quizzesInfos: [{ name: 'Perfil Comportamental', purchaseDate: '', type: 'standard' }],
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
  database: process.env.MONGODB_URI,
  adapter: MongoDBAdapter(getClientPromise()),
});