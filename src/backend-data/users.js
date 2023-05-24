const { getMongoCollection } = require("./utils/mongodb");
const { ObjectId } = require("mongodb");

const DATABASE = process.env.MONGODB_DB;
const COLLECTION_NAME = 'users';

async function getUserById(id) {
    const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
    const result = await collection.findOne({ _id: new ObjectId(id) })
    return result;
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

export {
    getUserById,
    setUserPlan,
    setCustomerIdInDatabase,
}