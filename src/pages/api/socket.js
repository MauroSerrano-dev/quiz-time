import { Server } from 'socket.io'
import { getFirestore, updateDoc, doc, getDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { getFirebaseConfig } from '@/backend-data/utils/firebase'
import { getDatabase, ref, set, onChildChanged, orderByChild, get, push, remove, onValue } from 'firebase/database'

export default function SocketHandler(req, res) {

  // Inicialize o aplicativo Firebase
  const firebaseConfig = getFirebaseConfig()

  const app = initializeApp(firebaseConfig)

  // Connect to Realtime Database
  const db = getDatabase()
  const dbFirestore = getFirestore()
  const roomsRef = ref(db, 'rooms')

  // Check if socket server has already been initialized
  if (res.socket.server.io) {
    console.log('Socket.IO server already set up')
    res.end();
    return;
  }

  // Monitorar todas as mudanças na coleção 'rooms'
  onChildChanged(roomsRef, async (snapshot) => {

    const roomCode = snapshot.key
    const roomData = snapshot.val()

    io.emit(`updateFieldsRoom${roomCode}`,
      {
        roomAtt: roomData,
      }
    )
  })

  // Initialize socket server
  const io = new Server(res.socket.server)
  console.log('Socket.IO server listening on port:', process.env.PORT || 3000)
  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log('Socket.io client connected')

    socket.on('getRoom', async (code) => {

      const roomRef = ref(db, `rooms/${code}`)
      // Obtém os dados da sala
      const roomSnapshot = await get(roomRef);
      const room = roomSnapshot.val();
      socket.emit(`sendRoom${code}`, room)
    })

    // Listen for 'updateRoom' events emitted by the client
    socket.on('updateRoom', async (updatedRoom) => {
      const newExpireAt = new Date()
      newExpireAt.setSeconds(newExpireAt.getSeconds() + 86400)

      // Atualize o campo de data de expiração ao documento
      const expireAt = new Date()
      expireAt.setSeconds(expireAt.getSeconds() + 86400)

      updatedRoom.expireDate = {
        text: expireAt.toString(),
        number: expireAt.valueOf(),
      }

      const roomRef = ref(db, `rooms/${updatedRoom.code}`)
      await set(roomRef, updatedRoom)
    })

    // Listen for 'saveResults' events emitted by the client
    socket.on('saveResults', (code) => {
      io.emit(`saveResults${code}`)
    })

    // Listen for 'updatePlayer' events emitted by the client
    socket.on('updatePlayer', async (attPlayer, code) => {

      const newExpireAt = new Date()
      newExpireAt.setSeconds(newExpireAt.getSeconds() + 86400)

      const roomRef = ref(db, `rooms/${code}/expireDate`)
      await set(roomRef,
        {
          text: newExpireAt.toString(),
          number: newExpireAt.valueOf(),
        }
      )

      const playerRef = ref(db, `rooms/${code}/players/${attPlayer.user.id}`)
      await set(playerRef, attPlayer)
    })

    // Listen for 'joinRoom' events emitted by the client
    socket.on('joinRoom', async (player, code) => {
      
      // Atualize o campo de data de expiração ao documento
      const expireAt = new Date()
      expireAt.setSeconds(expireAt.getSeconds() + 86400)

      const roomRef = ref(db, `rooms/${code}/expireDate`)
      await set(roomRef,
        {
          text: expireAt.toString(),
          number: expireAt.valueOf(),
        }
      )

      const playersRef = ref(db, `rooms/${code}/players/${player.user.id}`)
      await set(playersRef, player)
    })

    // Listen for 'leaveRoom' events emitted by the client
    socket.on('leaveRoom', async (playerId, code) => {

      const playerRef = ref(db, `rooms/${code}/players/${playerId}`);
      await remove(playerRef);
    })

    // Listen for 'saveSketch' events emitted by the client
    socket.on('saveSketch', async (id, email, sketch) => {
      const userRef = doc(dbFirestore, 'users', id);

      try {
        const userDoc = await getDoc(userRef);

        // Verifique se o documento existe
        if (userDoc.exists()) {
          const userData = userDoc.data()

          // Adicione ou atualize o campo 'sketchs' no documento
          userData.sketchs = [sketch]
          userData.updatedAt = serverTimestamp()

          // Salve o documento atualizado de volta no Firestore
          await updateDoc(userRef, userData)

          console.log('saveSketch successfully')
        } else {
          console.log('User document not found')
        }
      } catch (error) {
        console.log('Error saving sketch:', error)
      }
    })
  })

  console.log('Setting up socket');
  res.end();
}