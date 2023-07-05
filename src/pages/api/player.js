import { updatePlayer } from "../../backend-data/rooms";

export default async function handler(req, res) {

    if (req.method === "PATCH") {
        const { player, code } = req.body
        updatePlayer(player, code)
        res.status(200).json({
            message: "Room Atualizada com Sucesso!"
        })
    }
}