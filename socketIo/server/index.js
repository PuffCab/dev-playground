import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";
import colors from "colors";
import cors from "cors";

import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

import cloudinaryConfig from "./config/cloudinaryConfig.js";

import userRouter from "./routes/usersRouter.js";
import chatRouter from "./routes/chatsRouter.js";
import MessageModel from "./models/messagesModel.js";
const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: "http://localhost:5173",
  connectionStateRecovery: {}, //by default are 120000ms (2min)
  // connectionStateRecovery: {
  //   maxDisconnectionDuration:10000 // would wait for 10 seconds (time in ms)
  // }
});

const port = process.env.PORT || 5000;
//! for SQL
//#region
// io.on("connection", async (socket) => {
//   console.log("a user connected");
//   // console.log("socket :>> ", socket.id);
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });

//   socket.on("chat message", async (message) => {
//     console.log("message >>> " + message);
//     console.log(" socket.id >>> " + socket.id);
//     let result;
//     try {
//       result = await db.excute({
//         sql: "INSERT INTO messages (content) VALUES (:message)",
//         args: { msg: message },
//       });
//     } catch (error) {
//       console.error(error.message);
//       return;
//     }
//     io.emit("chat message", message, result.lastInsertRowid.toString()); //the last id inserted in the DB transformed in string
//   });
//   console.log(socket.handshake.auth); //info attached to the message
//   if (!socket.recovered) {
//     // --> to recover msgs without sent without conection
//     //si se ha conectado un nuevo cliente, y no se ha recuperado de una desconexion , recuperamos todos los mensajes

//     try {
//       const results = await db.execute({
//         sql: "SELECT id, content FROM messages WHERE id > ?",
//         args: [socket.handshake.auth.serverOffset ?? 0], //this should be the last message, and this info comes from the client. attached in the object `auth`. And if none, we make it 0
//         //  where the id is bigger than the serverOffset, is what we are gonna send to the client
//       });
//       results.forEach((row) => {
//         socket.emit("chat message", row.content, row.id);
//       });
//     } catch (error) {
//       console.error("error", error);
//     }
//   }
// });
//#endregion
io.on("connection", async (socket) => {
  console.log("a user connected");
  // console.log("socket :>> ", socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  //! using chat rooms
  // socket.on("join room", ({roomId, userId}) => {
  //   socket.join(roomId)
  //    console.log(`${userId} joined room ${roomId}`.bgYellow);
  // })

  socket.on("chat message", async (message) => {
    console.log("message >>> " + message);
    console.log(" socket.id >>> " + socket.id);
    console.log("socket.handshake.auth :>> ", socket.handshake.auth);
    let createdMsg;
    const author = socket.handshake.auth.author ?? "anonymous";
    try {
      createdMsg = await MessageModel.create({
        text: message,
        authorID: socket.id,
        author: author,
        postingDate: new Date().getTime(),
      });
      // console.log("createdMsg :>> ", createdMsg);
    } catch (error) {
      console.error(error.message);
      return;
    }
    io.emit("chat message", message, createdMsg.postingDate, author); //this will travel into the "serverOffset" property (we can add as many variables as we want, also an object with several)
    // io.to(message.roomId).emit("chat message", message, createdMsg.postingDate, author); //this will travel into the "serverOffset" property (we can add as many variables as we want, also an object with several)
  });

  // console.log("typeof  :>> ", socket.handshake.auth.serverOffset);
  // console.log("ooffsetnumber>>>>>", Number(socket.handshake.auth.serverOffset)); //info attached to the message
  // console.log("socket.recovered :>> ", socket.recovered);
  if (!socket.recovered) {
    // --> to recover msgs without sent without conection
    //si se ha conectado un nuevo cliente, y no se ha recuperado de una desconexion , recuperamos todos los mensajes
    const serverOffset = Number(socket.handshake.auth.serverOffset ?? 0) ?? 0;
    try {
      const recoveredMessages = await MessageModel.find({
        postingDate: { $gt: serverOffset ?? 0 },
      });
      console.log("recoveredMessages :>> ", recoveredMessages);
      recoveredMessages.forEach((msg) => {
        socket.emit("chat message", msg.text, msg.postingDate, msg.author);
      });
    } catch (error) {
      console.error("error", error);
    }
  }
});
function addMiddleWares() {
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(cors());
  cloudinaryConfig();
  app.use(morgan("dev"));
}

function startServer() {
  // app.listen(port, () => {
  //   console.log(`Server is running on port ${port}`.green);
  // });
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`.green);
  });
}

function loadRoutes() {
  app.use("/api/chats", chatRouter);
  app.use("/api/users", userRouter);
}

async function DBConnection() {
  try {
    const mongoDBConnection = await mongoose.connect(process.env.MONGODB_URI);
    if (mongoDBConnection) {
      console.log("connected with MongoDB".bgGreen);
    }
  } catch (error) {
    console.log("error connecting to MONGODB :>> ".bgRed, error);
  }
}

(async function () {
  await DBConnection();

  addMiddleWares();
  loadRoutes();
  startServer();
})();
