import { getRoom, addRoom } from "../../backend-data/rooms";

export default async function handler(req, res) {

    if (req.method === "GET") {
        const code = req.headers.code
        return res.status(200).json({ room: await getRoom(code) })
    }

    else if (req.method === "POST") {
        const newRoom = req.body
        const id = await addRoom(newRoom);
        res.status(201).json({
            message: 'Room Criada com Sucesso!',
            _id: id,
        })
    }
}