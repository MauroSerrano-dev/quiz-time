import { getUserById, setImg, saveSketch, createQuiz } from "../../backend-data/users";

export default async function handler(req, res) {

    if (req.method === "GET") {
        const id = req.headers.id
        const target = req.headers.target
        const quizRef = req.headers.target
        if (target === 'quiz')
            return res.status(200).json({ value: await getQuizNoImages(id, quizRef) })
        return res.status(200).json({ user: await getUserById(id) })
    }

    else if (req.method === "POST") {
        const {
            field,
            userEmail,
            sketch,
            type,
            elementId,
            newImg,
        } = req.body

        if (field === 'sketchs') {
            await saveSketch(userEmail, sketch);
            res.status(201).json({
                message: 'Rascunho Salvo com Sucesso!'
            })
        }

        if (field === 'img') {
            await setImg(userEmail, type, elementId, newImg);
            res.status(201).json({
                message: 'Imagem Armazenada com Sucesso!'
            })
        }
    }

    else if (req.method === "PATCH") {
        const {
            action,
            userEmail,
        } = req.body

        if (action === 'createQuiz') {
            await createQuiz(userEmail);
            res.status(201).json({
                message: 'Quiz Criado com Sucesso!'
            })
        }
    }
}