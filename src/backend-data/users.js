const { getMongoCollection } = require("./utils/mongodb");
const { ObjectId } = require("mongodb");

const DATABASE = process.env.MONGODB_DB;
const COLLECTION_NAME = 'users';

async function getUserById(id) {
    const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
    const result = await collection.findOne({ _id: new ObjectId(id) })
    return result;
}

async function getQuizNoImages(id, quizRef) {
    const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
    const result = await collection.findOne({ _id: new ObjectId(id), quizzes: { $elemMatch: { ref: quizRef } } })
    /* return result; */
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
        const prev = await collection.findOne({ email: email })
        
        const prevSketch = prev.sketchs[0]
        
        const result = await collection.updateOne(
            { email: email },
            {
                $set: {
                    'sketchs.0': {
                        ...sketch,
                        questions: sketch.questions.map((question, i) =>
                        ({
                            ...question,
                            img: prevSketch.questions[i].img,
                            options: question.options.map((option, j) => ({ ...option, img: prevSketch.questions[i].options[j].img }))
                        })),
                        results: sketch.results.map((result, i) => ({ ...result, img: prevSketch.results[i].img })),
                    }
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

async function setImg(email, type, elementId, newImg) {
    try {
        const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
        const result = await collection.updateOne(
            { email: email },
            {
                $set: {
                    [`sketchs.0.${type}.$[element].img`]: newImg
                }
            },
            {
                arrayFilters: [{ 'element.id': elementId }]
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
    setImg,
    getQuizNoImages,
    saveSketch,
    createQuiz
}