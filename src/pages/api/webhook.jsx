import { updateUserPlan } from "../../backend-data/users";

export default async function handler(req, res) {

    if (req.method === "POST") {
        const link = req.body.data.object.payment_link
        const email = req.body.data.object.customer_details.email
        console.log(link)
        console.log(email)
        let plan
        if (link === "plink_1NA3MIHqx2KsFA9zcbgjXuBF")
            plan = 'Premium'
        if (link === "plink_1NA4OTHqx2KsFA9zesGMYepK")
            plan = 'Silver'
        if (plan)
            updateUserPlan(email, plan)
        res.status(201).json({ message: `Plano do User ${email} Atualizado para ${plan} com Sucesso!` })
    }
}