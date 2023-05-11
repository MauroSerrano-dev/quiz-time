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
    console.log("MongoDB database connected");

    // Create a change stream for the rooms collection
    console.log("Setting change streams");
    const changeStream = mongoose.connection.collection(process.env.COLL_ROOMS).watch();

    // Listen for "change" events on the change stream
    changeStream.on("change", (change) => {
      const roomAttFields = { ...change.updateDescription.updatedFields };
      io.emit("updateFields", roomAttFields);
    });

  });

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

    // Listen for "updateQuiz" events emitted by the client
    socket.on("updateRoom", (updatedRoom) => {
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
        { code: updatedRoom.code },
        {
          ...updatedRoom,
          currentQuestion: updatedRoom.currentQuestion,
          players: updatedRoom.players,
          state: updatedRoom.state
        })
        .then(() => {
          console.log("Room updated successfully");
          /* io.emit("updateRoomSuccess", updatedRoom); */
        })
        .catch((err) => {
          console.log("Error updating room:", err);
          /* io.emit("updateRoomError", err); */
        });
    });

    // Get the current value of "active" from the rooms collection
    /*     mongoose.connection.collection(process.env.COLL_ROOMS).findOne({ code: req.headers.code })
          .then((result) => {
            console.log('code', req.headers.code, result)
            if (result) {
              const quiz = { ...result };
              socket.emit("getQuizForPlayer", quiz);
            }
          })
          .catch((err) => {
            console.log('Error getting data:', err);
          }); */
  });


  console.log("Setting up socket");
  res.end();
}
