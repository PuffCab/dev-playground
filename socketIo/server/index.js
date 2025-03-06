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
const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: "http://localhost:5173",
});

const port = process.env.PORT || 5000;

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat message", (message) => {
    console.log("message >>> " + message);
    io.emit("chat message", message);
  });
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
