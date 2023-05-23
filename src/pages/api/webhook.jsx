import { getCustomerEmail } from "@/backend-data/utils/stripe";
import { setUserPlan } from "../../backend-data/users";

export default async function handler(req, res) {

    if (req.method === "POST") {
        const type = req.body.type
        if (type === 'checkout.session.completed') {
            const email = req.body.data.object.customer_details.email
            const plan = req.body.data.object.metadata.plan
            await setUserPlan(email, plan)
            res.status(200).json({ message: `Plano do User ${email} Atualizado para ${plan} com Sucesso!` })
        }
        else if (type === 'customer.subscription.updated') {
            const customerId = req.body.data.object.customer
            const status = req.body.data.object.status
            const email = await getCustomerEmail(customerId)
            const plan = req.body.data.object.plan.id
            res.status(200).json({ message: `Subscription do ${email} está ${status} no plano ${plan}!` })
        }
        else
            res.status(200).json({ message: 'Outros eventos!' })
    }
}