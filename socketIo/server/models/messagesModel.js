import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    require: true,
    unique: false,
  },
  author: {
    type: String,
    // require: true,
    unique: false,
  },
  authorID: {
    type: String,
  },
  postingDate: {
    // type: Date,
    type: Number,
    // require: true,
    unique: false,
  },
});

const MessageModel = mongoose.model("Message", messageSchema);

export default MessageModel;
