import { updateUserPlan } from "../../backend-data/users";

export default async function handler(req, res) {

    if (req.method === "GET") {
        const code = req.headers.code
        return res.status(200).json({ room: await getRoom(code) })
    }

    else if (req.method === "POST") {
        console.log(req.body)
        console.log(req.body.payment_link)
        console.log(req.body.data.customer_details)
        console.log(req.body.data.object.customer_details)
        const link = req.body.object.payment_link
        const email = req.body.object.data.customer_details.email
        try {
            let plan
            if (link === "plink_1NA3MIHqx2KsFA9zcbgjXuBF")
                plan = 'Premium'
            if (link === "plink_1NA4OTHqx2KsFA9zesGMYepK")
                plan = 'Silver'
            if (plan)
                updateUserPlan(email, plan)
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
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