import { getQuiz, updateQuiz } from "../../backend-data/quizzesStandard";

export default async function handler(req, res) {

    if (req.method === "GET") {
        const quizName = req.headers.quizname
        return res.status(200).json({ quiz: await getQuiz(quizName) })
    }
    else if (req.method === "PATCH") {
        const { quiz } = req.body
        updateQuiz(quiz)
        res.status(200).json({
            message: 'Quiz Atualizado com Sucesso!'
        });
    }
}