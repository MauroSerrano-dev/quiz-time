import { getUserById } from "../../backend-data/users";

export default async function handler(req, res) {

    if (req.method === "GET") {
        const id = req.headers.id
        return res.status(200).json({ user: await getUserById(id) })
    }
}