const { getMongoCollection } = require("./utils/mongodb");

const DATABASE = process.env.MONGODB_DB;
const COLLECTION_NAME = 'users';

async function updateUserPlan(email, plan) {
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
    updateUser,
}