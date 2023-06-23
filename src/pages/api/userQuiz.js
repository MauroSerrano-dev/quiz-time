import { getQuiz } from "../../backend-data/users";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const userId = req.headers.userid
        const quizId = req.headers.quizid
        return res.status(200).json({ quiz: await getQuiz(userId, quizId) })
    }
}