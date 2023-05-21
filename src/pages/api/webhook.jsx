import { updateUserPlan } from "../../backend-data/users";

export default async function handler(req, res) {

    if (req.method === "POST") {
        const link = req.body.data.object.payment_link
        const email = req.body.data.object.customer_details.email
        console.log(link)
        console.log(email)
        let plan
        if (link === "plink_1NA6b9G4uTYyyhYy9Ven8Yr0")
            plan = 'Premium'
        if (link === "plink_1NA6lGG4uTYyyhYygoXXm9AD")
            plan = 'Silver'
        if (plan)
            updateUserPlan(email, plan)
        res.status(201).json({ message: `Plano do User ${email} Atualizado para ${plan} com Sucesso!` })
    }
}