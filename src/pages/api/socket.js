import { Server } from "socket.io";
const mongoose = require("mongoose");

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
        io.emit(`updateFieldsRoom${change.fullDocument.code}`, { roomAtt: change.fullDocument, fields: change.updateDescription.updatedFields })
      }
    })
  })

  // Initialize socket server
  const io = new Server(res.socket.server);
  console.log('Socket.IO server listening on port:', process.env.PORT || 3000);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log('Socket.io client connected');
    // Get the current value of "active" from the process.env.COLL_ROOMS collection
    mongoose.connection.collection(process.env.COLL_ROOMS).findOne({ code: socket.handshake.query.code })
      .then((result) => {
        const room = { ...result };
        socket.emit("getData", room);
      })
      .catch((err) => {
        console.log('Error getting initial data:', err);
      });

    // Listen for "updateRoom" events emitted by the client
    socket.on("updateRoom", (updatedRoom) => {
      console.log(updatedRoom)
      const RoomModel = mongoose.models.room
        ? mongoose.model("room")
        : mongoose.model("room", {
          code: String,
          owner: String,
          currentQuestion: Number,
          players: Array,
          state: String,
          control: Boolean,
        }, 'rooms');
      RoomModel.updateOne(
        { code: updatedRoom.code }, updatedRoom)
        .then(() => {
          console.log("Room updated successfully");
          /* io.emit("updateRoomSuccess", updatedRoom); */
        })
        .catch((err) => {
          console.log("Error updating room:", err);
          /* io.emit("updateRoomError", err); */
        })
    })

    // Listen for "updateAnswer" events emitted by the client
    socket.on("updateAnswer", (player, code) => {
      const RoomModel = mongoose.models.room
        ? mongoose.model("room")
        : mongoose.model("room", {
          code: String,
          owner: String,
          currentQuestion: Number,
          players: Array,
          state: String,
        }, 'rooms');
      RoomModel.updateOne(
        { code: code },
        {
          $set: {
            'players.$[element]': player
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
      const RoomModel = mongoose.models.room
        ? mongoose.model("room")
        : mongoose.model("room", {
          code: String,
          players: Array,
        }, 'rooms');
      RoomModel.updateOne(
        { code: code },
        {
          $push: { players: player }
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
      console.log('leaveRoomdsadsa')
      const RoomModel = mongoose.models.room
        ? mongoose.model("room")
        : mongoose.model("room", {
          code: String,
          players: Array,
        }, 'rooms');
      RoomModel.updateOne(
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
  })


  console.log("Setting up socket");
  res.end();
}
