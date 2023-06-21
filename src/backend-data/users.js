const { getMongoCollection } = require("./utils/mongodb");
const { ObjectId } = require("mongodb");

const DATABASE = process.env.MONGODB_DB;
const COLLECTION_NAME = 'users';

async function getUserById(id) {
    const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
    const result = await collection.findOne({ _id: new ObjectId(id) })
    return result;
}

async function getUserFieldById(id, field) {
    const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
    const result = await collection.findOne({ _id: new ObjectId(id) })
    return result[field];
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

async function pushUserQuiz(email, newQuiz) {
    try {
        const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
        const result = await collection.updateOne(
            { email: email },
            {
                $push: {
                    'quizzes': newQuiz
                }
            }
        )
        return result
    } catch (error) {
        console.error('Erro ao adicionar o quiz do usuário:', error)
        throw error
    }
}

async function pushUserImg(email, newImg) {
    try {
        const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
        const result = await collection.updateOne(
            { email: email },
            {
                $push: {
                    'imgsSrc': newImg
                }
            }
        )
        return result
    } catch (error) {
        console.error('Erro ao adicionar a imagem do usuário:', error)
        throw error
    }
}

export {
    getUserById,
    setUserPlan,
    setCustomerIdInDatabase,
    pushUserQuiz,
    pushUserImg,
    getUserFieldById
}