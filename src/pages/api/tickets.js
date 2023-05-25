import { getTicket, updateTicket, addTicket } from "../../backend-data/tickets";

export default async function handler(req, res) {

    if (req.method === "GET") {
        const id = req.headers.id
        return res.status(200).json({ room: await getTicket(id) })
    }

    else if (req.method === "POST") {
        const id = await addTicket(req.body);
        res.status(201).json({
          message: "Ticket Criado com Sucesso!",
          _id: id,
        })
    }

    else if (req.method === "PATCH") {
        const { room } = req.body
        updateTicket(room)
        res.status(200).json({
            message: "Ticket Atualizado com Sucesso!"
        })
    }
}