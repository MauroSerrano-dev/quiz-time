import { getRoom, updateRoom, addRoom } from "../../backend-data/rooms";

export default async function handler(req, res) {

    if (req.method === "GET") {
        const code = req.headers.code
        return res.status(200).json({ room: await getRoom(code) })
    }

    else if (req.method === "POST") {
        const id = await addRoom(req.body);
        res.status(201).json({
          message: "Room Criada com Sucesso!",
          _id: id,
        })
    }

    else if (req.method === "PATCH") {
        const { room } = req.body
        updateRoom(room)
        res.status(200).json({
            message: `Room Atualizada com Sucesso!`
        })
    }
}