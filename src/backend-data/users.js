const { getMongoCollection } = require("./utils/mongodb");
const { ObjectId } = require("mongodb");

const DATABASE = process.env.MONGODB_DB;
const COLLECTION_NAME = 'users';

async function getUserById(id) {
    const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
    const result = await collection.findOne({ _id: new ObjectId(id) })
    return result;
}

async function getQuiz(id, quizId) {
    const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
    const result = await collection.aggregate([
        { $match: { _id: new ObjectId(id) } },
        { $unwind: "$quizzes" },
        { $match: { "quizzes.id": quizId } },
        { $project: { _id: 0, quizzes: 1 } }
    ]).toArray();

    if (result.length > 0) {
        return result[0].quizzes;
    } else {
        return null;
    }
}

async function setCustomerIdInDatabase(email, customerId) {
    const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
    const result = await collection.updateOne(
        { email: email },
        {
            $set: {
                'stripeCustomerId': customerId
            }
        }
    )
    return result;
}

async function setUserPlan(email, plan) {
    const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
    const result = await collection.updateOne(
        { email: email },
        {
            $set: {
                'plan': plan
            }
        }
    )
    return result;
}

async function saveSketch(email, sketch) {
    try {
        const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
        const result = await collection.updateOne(
            { email: email },
            {
                $set: {
                    'sketchs.0': [sketch]
                }
            }
        )
        return result
    } catch (error) {
        console.error('Erro ao salvar o rascunho do usuário:', error)
        throw error
    }
}

async function createQuiz(email) {
    try {
        const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);

        const prev = await collection.findOne({ email: email })

        const newQuiz = prev.sketchs[0]

        const quizInfo = {
            name: newQuiz.name,
            id: newQuiz.id,
            category: newQuiz.category,
            mode: newQuiz.mode,
        }

        const result = await collection.updateOne(
            { email: email },
            {
                $push: {
                    'quizzes': newQuiz,
                    'quizzesInfo': quizInfo,
                }
            }
        )
        return result
    } catch (error) {
        console.error('Erro ao adicionar o quiz do usuário:', error)
        throw error
    }
}

export {
    getUserById,
    setUserPlan,
    setCustomerIdInDatabase,
    saveSketch,
    createQuiz,
    getQuiz
}