import { updateUserPlan } from "../../backend-data/users";

export default async function handler(req, res) {

    if (req.method === "GET") {
        const code = req.headers.code
        return res.status(200).json({ room: await getRoom(code) })
    }

    else if (req.method === "POST") {
        try {
            let plan
            if (req.body.payment_link === "plink_1NA3MIHqx2KsFA9zcbgjXuBF")
                plan = 'Premium'
            if (req.body.payment_link === "plink_1NA4OTHqx2KsFA9zesGMYepK")
                plan = 'Silver'
            if (plan)
                updateUserPlan(req.body.data.customer_details.email, plan)
        }
        catch (error) {
            res.status(500).json({ msg: `Error: ${error}` })
            console.error(`Error: ${error}`);
        }
        res.status(201).json({ message: `Plano do User ${req.body.data.customer_details.email} Atualizado com Sucesso!` })
    }

    else if (req.method === "PATCH") {
        const { room } = req.body
        updateRoom(room)
        res.status(200).json({
            message: `Room Atualizada com Sucesso!`
        })
    }
}