import { Server } from "socket.io";
const mongoose = require("mongoose");

const INICIAL_IMG = {
  content: '',
  name: '',
  type: '',
  ref: '',
}

export default function SocketHandler(req, res) {

  // Check if socket server has already been initialized
  if (res.socket.server.io) {
    console.log("Socket.IO server already set up");
    res.end();
    return;
  }
  // Connect to MongoDB database
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Handle MongoDB connection errors
  mongoose.connection.on("error", err => {
    console.log("MongoDB connection error:", err);
  });

  // MongoDB connection successful
  mongoose.connection.once("open", () => {
    console.log("MongoDB database connected")

    // Create a change stream for the rooms collection
    console.log("Setting change streams")
    const changeStream = mongoose.connection.collection(process.env.COLL_ROOMS).watch([], { fullDocument: 'updateLookup' })

    // Listen for "change" events on the change stream
    changeStream.on("change", (change) => {
      if (change.updateDescription) {
        io.emit(`updateFieldsRoom${change.fullDocument.code}`,
          {
            roomAtt: change.fullDocument,
            fields: change.updateDescription.updatedFields
          })
      }
    })
  })

  // Initialize socket server
  const io = new Server(res.socket.server);
  console.log('Socket.IO server listening on port:', process.env.PORT || 3000);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log('Socket.io client connected')
    const roomsCollection = mongoose.connection.collection("rooms")
    const usersCollection = mongoose.connection.collection("users")

    // Get the current value of "active" from the process.env.COLL_ROOMS collection
    mongoose.connection.collection(process.env.COLL_ROOMS).findOne({ code: socket.handshake.query.code })
      .then((result) => {
        const room = result ? { ...result } : null
        socket.emit("getData", room)
      })
      .catch((err) => {
        console.log('Error getting initial data:', err)
      })

    // Listen for "updateRoom" events emitted by the client
    socket.on("updateRoom", (updatedRoom) => {
      delete updatedRoom.expireAt
      // Verifique se o campo 'expireAt' existe no documento
      const newExpireAt = new Date()
      newExpireAt.setSeconds(newExpireAt.getSeconds() + 1)

      // Atualize o campo 'expireAt' com o novo tempo de expiração
      updatedRoom.expireAt = newExpireAt;

      delete updatedRoom._id
      // Obtenha uma referência à coleção "rooms" do MongoDB
      roomsCollection.updateOne(
        { code: updatedRoom.code },
        { $set: updatedRoom }
      )
        .then(() => {
          console.log("Room updated successfully");
          /* io.emit("updateRoomSuccess", updatedRoom); */
        })
        .catch((err) => {
          console.log("Error updating room:", err);
          /* io.emit("updateRoomError", err); */
        });
    })

    // Listen for "updateAnswer" events emitted by the client
    socket.on("updateAnswer", (player, code) => {
      const newExpireAt = new Date()
      newExpireAt.setSeconds(newExpireAt.getSeconds() + 86400)
      roomsCollection.updateOne(
        { code: code },
        {
          $set: {
            'players.$[element]': player,
            expireAt: newExpireAt
          }
        },
        {
          arrayFilters: [{ 'element.user.email': player.user.email }]
        }
      )
        .then(() => {
          console.log("Answer updated successfully");
          /* io.emit("updateRoomSuccess", updateAnswer); */
        })
        .catch((err) => {
          console.log("Error updating answer:", err);
          /* io.emit("updateRoomError", err); */
        })
    })

    // Listen for "joinRoom" events emitted by the client
    socket.on("joinRoom", (player, code) => {
      const newExpireAt = new Date()
      newExpireAt.setSeconds(newExpireAt.getSeconds() + 86400)
      roomsCollection.updateOne(
        { code: code },
        {
          $push: {
            players: player
          },
          $set: {
            expireAt: newExpireAt
          }
        }
      )
        .then(() => {
          console.log("JoinRoom successfully");
          /* io.emit("updateRoomSuccess", updatedRoom); */
        })
        .catch((err) => {
          console.log("Error joinRoom:", err);
          /* io.emit("updateRoomError", err); */
        })
    })
    // Listen for "leaveRoom" events emitted by the client
    socket.on("leaveRoom", (playerEmail, code) => {
      roomsCollection.updateOne(
        { code: code },
        {
          $pull: { players: { "user.email": playerEmail } }
        },
        {
          arrayFilters: [{ "element.user.email": playerEmail }]
        }
      )
        .then(() => {
          console.log("leaveRoom successfully");
          /* io.emit("updateRoomSuccess", updatedRoom); */
        })
        .catch((err) => {
          console.log("Error leaveRoom:", err);
          /* io.emit("updateRoomError", err); */
        })
    })
    // Listen for "saveSketch" events emitted by the client
    socket.on("saveSketch", async (email, sketch) => {
      const prev = await usersCollection.findOne({ email: email })

      const prevSketch = prev.sketchs.length > 0 ? prev.sketchs[0] : undefined

      function getPrevQuestionsImg(id) {
        for (let i = 0; i < prevSketch.questions.length; i++) {
          if (prevSketch.questions[i].id === id) {
            return prevSketch.questions[i].img
          }
        }
        return INICIAL_IMG
      }

      function getPrevResultsImg(id) {
        for (let i = 0; i < prevSketch.results.length; i++) {
          if (prevSketch.results[i].id === id) {
            return prevSketch.results[i].img
          }
        }
        return INICIAL_IMG
      }

      function getPrevOptionsImg(questionId, optionIndex) {
        for (let i = 0; i < prevSketch.questions.length; i++) {
          if (prevSketch.questions[i].id === questionId) {
            for (let j = 0; j < prevSketch.questions[i].options.length; j++) {
              return prevSketch.questions[i].options[optionIndex].img
            }
          }
        }
        return INICIAL_IMG
      }
      console.log(sketch)
      usersCollection.updateOne(
        { email: email },
        {
          $set: {
            sketchs:
              prevSketch
                ? [{
                  ...sketch,
                  questions: sketch.questions.map((question, i) =>
                  ({
                    ...question,
                    img: getPrevQuestionsImg(question.id),
                    options: question.options.map((option, j) => ({ ...option, img: getPrevOptionsImg(question.id, j) }))
                  })),
                  results: sketch.results.map((result, i) => ({ ...result, img: getPrevResultsImg(result.id) })),
                }]
                : [sketch]
          }
        }
      )
        .then(() => {
          console.log("saveSketch successfully");
          /* io.emit("updateRoomSuccess", updatedRoom); */
        })
        .catch((err) => {
          console.log("Error saveSketch:", err);
          /* io.emit("updateRoomError", err); */
        })
    })
  })


  console.log("Setting up socket");
  res.end();
}