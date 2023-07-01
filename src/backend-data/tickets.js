const { getMongoCollection } = require("./utils/mongodb");

const DATABASE = process.env.MONGODB_DB;
const COLLECTION_NAME = process.env.COLL_TICKETS;

async function getTicket(id) {
  const db = getFirestore();
  const userRef = doc(db, process.env.COLL_TICKETS, id)

  try {
    const ticketDoc = await getDoc(userRef)

    // Verifique se o documento existe
    if (ticketDoc.exists()) {
      const ticketData = ticketDoc.data()

      return ticketData
    } else {
      console.log("Ticket document not found")
    }
  } catch (error) {
    console.log("Error getting ticket:", error)
  }
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