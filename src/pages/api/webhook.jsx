import { getCustomerEmail, getPlanById } from "@/backend-data/utils/stripe";
import { setUserPlan } from "../../backend-data/users";

export default async function handler(req, res) {

    if (req.method === "POST") {
        const type = req.body.type
        if (type === 'checkout.session.completed') {
            const email = req.body.data.object.customer_details.email
            const planName = req.body.data.object.metadata.planName
            await setUserPlan(email, { name: planName, status: 'active' })
            res.status(200).json({ message: `User ${email} Adquiriu ${planName}!` })
        }
        else if (type === 'customer.subscription.updated' || type === 'customer.subscription.deleted') {
            const customerId = req.body.data.object.customer
            const status = req.body.data.object.status
            const email = await getCustomerEmail(customerId)
            const planId = req.body.data.object.plan.id
            const plan = await getPlanById(planId)
            const planName = plan.metadata.name
            await setUserPlan(email, { name: planName, status: status })
            res.status(200).json({ message: `Subscription do ${email} está ${status} no plano ${planName}!` })
        }
        else
            res.status(200).json({ message: 'Outros eventos!' })
    }
}