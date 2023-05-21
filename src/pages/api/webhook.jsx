import { updateUserPlan } from "../../backend-data/users";

export default async function handler(req, res) {

    if (req.method === "GET") {
        const code = req.headers.code
        return res.status(200).json({ room: await getRoom(code) })
    }

    else if (req.method === "POST") {
        const { email } = req.body.data.customer_details
        const link = req.body.payment_link
        let plan
        if (link=== "plink_1NA3MIHqx2KsFA9zcbgjXuBF")
            plan = 'premium'
        if (link=== "plink_1NA4OTHqx2KsFA9zesGMYepK")
            plan = 'silver'
        if (plan)
            updateUserPlan(email, plan)
        res.status(201).json({ message: `Plano do User ${email} Atualizado com Sucesso!` })
    }

    else if (req.method === "PATCH") {
        const { room } = req.body
        updateRoom(room)
        res.status(200).json({
            message: `Room Atualizada com Sucesso!`
        })
    }
}