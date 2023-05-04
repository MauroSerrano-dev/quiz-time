import { MongoClient } from "mongodb"
const URL = process.env.MONGODB_URI ?? "mongodb://localhost:3000"

let client

async function connectToMongo() {
    if (!client) {
        client = await new MongoClient(URL).connect()
    }
    return client
}

async function getClientPromise() {
    const client = await connectToMongo()
    return client.connect()
}

async function getMongoCollection(dbName, collectionName) {
    const client = await connectToMongo()
    return client.db(dbName).collection(collectionName)
}
export {
    getMongoCollection,
    getClientPromise
}