import { updateUserPlan } from "../../backend-data/users";

export default async function handler(req, res) {

    if (req.method === "POST") {
        const type = req.body.data.type
        if (type === 'checkout.session.completed') {
            const email = req.body.data.object.customer_details.email
            const plan = req.body.data.object.metadata.plan
            updateUserPlan(email, plan)
            res.status(201).json({ message: `Plano do User ${email} Atualizado para ${plan} com Sucesso!` })
        }
        else if (type === 'subscription_schedule.canceled')
            res.status(201).json({ message: 'subscription_schedule.canceled!' })
        else if (type === 'customer.subscription.updated')
            res.status(201).json({ message: 'customer.subscription.updated!' })
        else if (type === 'customer.subscription.deleted')
            res.status(201).json({ message: 'customer.subscription.deleted!' })
        else if (type === 'customer.subscription.created')
            res.status(201).json({ message: 'customer.subscription.created!' })
    }
}