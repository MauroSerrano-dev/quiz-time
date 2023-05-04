const { getMongoCollection } = require("./utils/mongodb");

const DATABASE = process.env.MONGODB_DB;
const COLLECTION_NAME = process.env.COLL_ROOMS;

async function getRoom(code) {
  const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
  const result = await collection.findOne({ code: code });
  return result;
}

async function addUser(user) {
  const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
  const result = await collection.insertOne(user);
  return result.insertedId;
}

async function getAllUsers() {
  const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
  const result = await collection.find().toArray();
  return result;
}

async function getUserByEmail(email) {
  const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
  const result = await collection.findOne({ email: email });
  return result;
}

async function updateRoom(room) {
  const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
  delete room._id;
  const result = await collection.updateOne(
    { code: room.code },
    { $set: { ...room } }
  );
  return result;
}

async function addDailyQuestDate(userEmail, dailyQuestInfos) {
  const { questIndex, date } = dailyQuestInfos
  const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
  const user = await collection.findOne({ email: userEmail });
  const newDailyQuests = user.dailyQuests.map((quest, i) => i === questIndex ? { ...quest, dates: [...quest.dates, date] } : quest)
  const result = await collection.updateOne(
    { email: userEmail },
    { $set: { dailyQuests: newDailyQuests } }
  );
  return result;
}

async function removeDailyQuestDate(userEmail, dailyQuestInfos) {
  const { questIndex, date } = dailyQuestInfos
  const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
  const user = await collection.findOne({ email: userEmail });
  const newDailyQuests = user.dailyQuests.map((quest, i) => i === questIndex ? { ...quest, dates: quest.dates.filter(d => d != date) } : quest)
  const result = await collection.updateOne(
    { email: userEmail },
    { $set: { dailyQuests: newDailyQuests } }
  );
  return result;
}

export {
  getRoom,
  updateRoom
}