import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get } from 'firebase/database'
import { getFirebaseConfig } from './utils/firebase';

const firebaseConfig = getFirebaseConfig()

const app = initializeApp(firebaseConfig)

async function getRoom(code) {

  const db = getDatabase()

  const reference = ref(db, 'rooms/' + code)

  return get(reference)
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

export {
  getRoom,
  addRoom,
}