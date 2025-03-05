import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  text: {
    type: String,
    require: true,
    unique: false,
  },
  author: {
    type: String,
    require: true,
    unique: false,
  },
  postingDate: {
    type: Date,
    require: true,
    unique: false,
  },
});

const ChatMessageModel = mongoose.model("Chat", chatMessageSchema);

export default ChatMessageModel;
