import express from "express";

const chatRouter = express.Router();

chatRouter.get("/", (req, res) => {
  res.send("Hello World");
});

export default chatRouter;