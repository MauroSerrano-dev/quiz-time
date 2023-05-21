const { getMongoCollection } = require("./utils/mongodb");

const DATABASE = process.env.MONGODB_DB;
const COLLECTION_NAME = 'users';

async function updateUser() {
    const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
    const result = await collection.updateOne(
        { email: 'mauro.r.serrano.f@gmail.com' },
        {
            $set: {
                'subscriptionPlan': 'premium'
            }
        }
    )
    return result;
}

export {
    updateUser,
}