import NextAuth from "next-auth"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import GoogleProvider from 'next-auth/providers/google';
import { getClientPromise } from "../../../backend-data/utils/mongodb";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      profile(profile) {
        console.log(profile)
        return {
          id: profile.email,
          name: profile.name,
          email: profile.email,
          subscriptionPlan: 'free',
          image: profile.picture,
          createAt: new Date(),
          quizzesInfos: [{ name: 'Perfil Comportamental', purchaseDate: '', type: 'standard' }],
          quizzesCustom: [],
          purchases: [],
        }
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    session: async (session) => {
      return Promise.resolve(session);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  /*     jwt: {
        signingKey: process.env.NEXTAUTH_SECRET,
      }, */

  // A database is optional, but required to persist accounts in a database
  database: process.env.MONGODB_URI,
  adapter: MongoDBAdapter(getClientPromise()),
});