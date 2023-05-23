/* import { setCustomerIdInDatabase } from "../../backend-data/users";

export default async function handler(req, res) {

    if (req.method === "POST") {
        const type = req.body.type
        if (type === 'checkout.session.completed') {
            const email = req.body.data.object.customer_details.email
            const plan = req.body.data.object.metadata.plan
            setUserPlan(email, plan)
            res.status(200).json({ message: `Plano do User ${email} Atualizado para ${plan} com Sucesso!` })
        }
        else
            res.status(200).json({ message: 'Outros eventos!' })
    }
} */