import { getQuiz, updateQuiz, getAllQuizzesInfo } from "../../backend-data/quizzesStandard";

export default async function handler(req, res) {

    if (req.method === "GET") {
        const quizid = req.headers.quizid
        const type = req.headers.type
        if (type === 'info')
            return res.status(200).json({ quizzes: await getAllQuizzesInfo() })
        return res.status(200).json({ quiz: await getQuiz(quizid) })
    }
    else if (req.method === "PATCH") {
        const { quiz } = req.body
        updateQuiz(quiz)
        res.status(200).json({
            message: 'Quiz Atualizado com Sucesso!'
        });
    }
}