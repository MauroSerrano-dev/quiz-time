const { getMongoCollection } = require("./utils/mongodb");

const DATABASE = process.env.MONGODB_DB;
const COLLECTION_NAME = process.env.COLL_TICKETS;

async function getTicket(id) {
  const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
  const result = await collection.findOne({ _id: id });
  return result;
}

async function addTicket(ticket) {
  const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
  const result = await collection.insertOne(ticket);
  return result.insertedId;
}

async function updateTicket(ticket) {
  const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
  delete ticket._id;
  const result = await collection.updateOne(
    { id: ticket.id },
    { $set: { ...ticket } }
  );
  return result;
}

export {
  getTicket,
  updateTicket,
  addTicket
}