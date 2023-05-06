const { getMongoCollection } = require("./utils/mongodb");

const DATABASE = process.env.MONGODB_DB;
const COLLECTION_NAME = 'quizzesStandard';

async function getQuiz(code) {
    const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
    const result = await collection.findOne({ code: code });
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
    updateQuiz
}