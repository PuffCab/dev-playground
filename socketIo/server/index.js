import express from "express";
import morgan from "morgan";

import colors from "colors";
import cors from "cors";

import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

import cloudinaryConfig from "./config/cloudinaryConfig.js";

import userRouter from "./routes/usersRouter.js";
import chatRouter from "./routes/chatsRouter.js";
const app = express();

const port = process.env.PORT || 5000;

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
  app.listen(port, () => {
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
