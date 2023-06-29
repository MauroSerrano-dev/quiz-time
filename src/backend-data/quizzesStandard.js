const { getMongoCollection } = require("./utils/mongodb");
const { ObjectId } = require("mongodb");

const DATABASE = process.env.MONGODB_DB;
const COLLECTION_NAME = 'quizzesStandard';

async function getQuiz(id) {
    const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
    const result = await collection.findOne({ _id: new ObjectId(id) });
    return result;
}

async function getAllQuizzesInfo() {
    const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
    const quizzes = await collection.find().toArray();
    const result = quizzes.map(quiz => (
        {
            id: quiz._id,
            name: quiz.name,
            type: 'standard'
        }
    ))
    return result;
}

async function updateQuiz(quiz) {
    const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
    delete quiz._id;
    const result = await collection.updateOne(
        { name: quiz.name },
        { $set: { ...quiz } }
    );
    return result;
}


export {
    getQuiz,
    updateQuiz,
    getAllQuizzesInfo
}