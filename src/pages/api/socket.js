import { Server } from "socket.io";
const mongoose = require("mongoose");
const QuizModel = mongoose.model.quiz || mongoose.model("quiz", { active: Boolean }, 'quizzesa');

export default function SocketHandler(req, res) {
  // Connect to MongoDB database
  mongoose.connect('mongodb+srv://mauroserrano:MongoMrsf1@cluster.tjk9fxo.mongodb.net/quiz_makaaaaer?retryWrites=true&w=majority', {
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

    // Create a change stream for the "quizzesa" collection
    console.log("Setting change streams");
    const changeStream = mongoose.connection.collection("quizzesa").watch();

    // Listen for "change" events on the change stream
    changeStream.on("change", (change) => {
      console.log('change event received with value:', change.updateDescription.updatedFields.active);
      const quiz = {
        active: change.updateDescription.updatedFields.active,
      };
      io.emit("getData", quiz);
    });

  });

  // Check if socket server has already been initialized
  if (res.socket.server.io) {
    console.log("Socket.IO server already set up");
    res.end();
    return;
  }

  // Initialize socket server
  const io = new Server(res.socket.server);
  console.log('Socket.IO server listening on port:', process.env.PORT || 3000);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log('Socket.io client connected');

    // Listen for "updateQuiz" events emitted by the client
    socket.on("updateQuiz", (updatedQuiz) => {
      QuizModel.updateOne({ code: 'abc' }, { ...updatedQuiz, active: updatedQuiz.active })
        .then(() => {
          console.log("Quiz updated successfully");
          /* io.emit("updateQuizSuccess", updatedQuiz); */
        })
        .catch((err) => {
          console.log("Error updating quiz:", err);
          /* io.emit("updateQuizError", err); */
        });
    });

    // Get the current value of "active" from the "quizzesa" collection
    mongoose.connection.collection("quizzesa").findOne({ owner: req.headers.email })
      .then((result) => {
        console.log('email', req.headers.email)
        const quiz = { ...result };
        socket.emit("getData", quiz);
      })
      .catch((err) => {
        console.log('Error getting initial data:', err);
      });

    // Get the current value of "active" from the "quizzesa" collection
/*     mongoose.connection.collection("quizzesa").findOne({ code: req.headers.code })
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
