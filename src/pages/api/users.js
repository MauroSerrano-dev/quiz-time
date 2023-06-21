import { getUserById, pushUserQuiz, pushUserImg, getUserFieldById } from "../../backend-data/users";

export default async function handler(req, res) {

    if (req.method === "GET") {
        const id = req.headers.id
        const field = req.headers.field
        if(field)
            return res.status(200).json({ value: await getUserFieldById(id, field) })
        return res.status(200).json({ user: await getUserById(id) })
    }

    else if (req.method === "POST") {
        const { field, userEmail, newQuiz, newImg } = req.body
        if (field === 'quizzes') {
            await pushUserQuiz(userEmail, newQuiz);
            res.status(201).json({
                message: 'Quiz Criado com Sucesso!'
            })
        }

        if (field === 'imgsSrc') {
            const ref = await pushUserImg(userEmail, newImg);
            res.status(201).json({
                message: 'Imagem Armazenada com Sucesso!',
                ref: ref
            })
        }
    }
}