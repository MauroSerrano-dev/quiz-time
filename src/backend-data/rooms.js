import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set } from 'firebase/database'
import { getFirebaseConfig } from './utils/firebase';

const firebaseConfig = getFirebaseConfig()

const app = initializeApp(firebaseConfig)

function addNewRoom(code, room) {

}

const COLLECTION_NAME = process.env.COLL_ROOMS;

async function getRoom(code) {
  const result = await collection.findOne({ code: code });
  return result;
}

async function addRoom(room) {

  // Adicione o campo de data de expiração ao documento
  const expireAt = new Date();
  expireAt.setSeconds(expireAt.getSeconds() + 86400);

  const db = getDatabase()

  const reference = ref(db, 'rooms/' + room.code)

  set(reference,
    {
      ...room,
      expireDate: {
        text: expireAt.toString(),
        number: expireAt.valueOf(),
      }
    }
  )
}

function updatePlayer(player, code) {

  const db = getDatabase()

  const reference = ref(db, 'rooms/' + code + '/players/' + player.id)

  set(reference, player)
}

export {
  getRoom,
  addRoom,
  updatePlayer
}