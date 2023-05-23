const { getMongoCollection } = require("./utils/mongodb");

const DATABASE = process.env.MONGODB_DB;
const COLLECTION_NAME = 'users';

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
                'subscriptionPlan': plan
            }
        }
    )
    return result;
}

export {
    setUserPlan,
    setCustomerIdInDatabase,
}