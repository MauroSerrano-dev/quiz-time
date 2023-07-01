import { getUserById, createQuiz } from "../../backend-data/users";

export default async function handler(req, res) {

    if (req.method === "GET") {
        const id = req.headers.id
        return res.status(200).json({ user: await getUserById(id) })
    }

    else if (req.method === "PATCH") {
        const {
            action,
            userId,
            userEmail,
        } = req.body
        console.log('api', action, userEmail)

        if (action === 'createQuiz') {
            await createQuiz(userId, userEmail);
            res.status(201).json({
                message: 'Quiz Criado com Sucesso!'
            })
        }
    }
}