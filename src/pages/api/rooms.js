import { getRoom } from "../../backend-data/rooms";

export default async function handler(req, res) {

    if (req.method === "GET") {
        const code = req.headers.code
        return res.status(200).json({ room: await getRoom(code) })
    }
}