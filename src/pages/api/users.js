import { getUserById, saveSketch, createQuiz } from "../../backend-data/users";

export default async function handler(req, res) {

    if (req.method === "GET") {
        const id = req.headers.id
        return res.status(200).json({ user: await getUserById(id) })
    }

    else if (req.method === "POST") {
        const {
            field,
            userEmail,
            sketch,
        } = req.body

        if (field === 'sketchs') {
            await saveSketch(userEmail, sketch);
            res.status(201).json({
                message: 'Rascunho Salvo com Sucesso!'
            })
        }
    }

    else if (req.method === "PATCH") {
        const {
            action,
            userEmail,
        } = req.body
        console.log('api', action, userEmail)

        if (action === 'createQuiz') {
            await createQuiz(userEmail);
            res.status(201).json({
                message: 'Quiz Criado com Sucesso!'
            })
        }
    }
}