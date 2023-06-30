const { getMongoCollection } = require("./utils/mongodb");
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set } from 'firebase/database'
import { getFirebaseConfig } from './utils/firebase';

const firebaseConfig = getFirebaseConfig()

const app = initializeApp(firebaseConfig)

function addNewRoom(code, room) {

}

const DATABASE = process.env.MONGODB_DB;
const COLLECTION_NAME = process.env.COLL_ROOMS;

async function getRoom(code) {
  const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);
  const result = await collection.findOne({ code: code });
  return result;
}

async function addRoom(room) {
  
  // Adicione o campo de data de expiração ao documento
  const expireAt = new Date();
  expireAt.setSeconds(expireAt.getSeconds() + 86400);
  room.expireAt = expireAt;

  
  const db = getDatabase()

  const reference = ref(db, 'rooms/' + room.code)
  
  set(reference, {
    ...room,
    expireDate: {
      text: expireAt.toString(),
      number: expireAt.valueOf(),
    }
  })
  
  const collection = await getMongoCollection(DATABASE, COLLECTION_NAME);

  const result = await collection.insertOne(room);

  // Crie o índice de expiração se ainda não existir
  await collection.createIndex({ expireAt: 1 }, { expireAfterSeconds: 86400 });
  return result.insertedId;
}

async function updateRoom(room) {
  const collection = await getMongoCollection(DATABASE, COLLECTION_NAME)

  // Verifique se o campo 'expireAt' existe no documento
  if (room.expireAt) {
    // Adicione 24 horas à data atual para definir o novo tempo de expiração
    const newExpireAt = new Date()
    newExpireAt.setSeconds(newExpireAt.getSeconds() + 86400)
    // Atualize o campo 'expireAt' com o novo tempo de expiração
    room.expireAt = newExpireAt
  }

  delete room._id
  const result = await collection.updateOne(
    { code: room.code },
    { $set: { ...room } }
  )
  return result;
}

export {
  getRoom,
  updateRoom,
  addRoom
}