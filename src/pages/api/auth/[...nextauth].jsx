import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from 'next-auth/providers/google';
import { getClientPromise } from "../../../backend-data/utils/mongodb";
import { createCustomer, getCustomerByEmail } from "../../../backend-data/utils/stripe";
import { setCustomerIdInDatabase } from '../../../backend-data/users'

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
          subscriptionPlan: 'Free',
          image: profile.picture,
          createAt: new Date(),
          quizzesInfos: [{ name: 'Perfil Comportamental', purchaseDate: '', type: 'standard' }],
          quizzesCustom: [],
          purchases: [],
        }
      },
    }),
  ],
  callbacks: {
    session: async (props) => {
      const {session, user} = props
      // Verifique se o usuário está definido e possui um e-mail
      console.log(session, user)
      if (user && user.email) {
        try {
          const existingCustomer = await getCustomerByEmail(user.email);
          if (!existingCustomer) {
            // O customer não existe, crie um novo customer no Stripe
            const customerId = await createCustomer(user.email, user.name);

            // Atualize o campo 'stripeCustomerId' no banco de dados
            await setCustomerIdInDatabase(user.email, customerId);
          }
        } catch (error) {
          console.error("Erro ao criar/atualizar o customer:", error);
        }
      }

      // Retorne a sessão atualizada
      return Promise.resolve(props);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  database: process.env.MONGODB_URI,
  adapter: MongoDBAdapter(getClientPromise()),
});
