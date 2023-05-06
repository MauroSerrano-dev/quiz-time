import { getQuiz, updateQuiz } from "../../backend-data/quizzesStandard";

export default async function handler(req, res) {

    if (req.method === "GET") {
        const code = req.headers.code
        return res.status(200).json({ room: await getQuiz(code) })
    }
    else if (req.method === "PATCH") {
        const { quiz } = req.body
        updateQuiz(quiz)
        res.status(200).json({
            message: `Quiz Atualizado com Sucesso!`
        });
    }
}