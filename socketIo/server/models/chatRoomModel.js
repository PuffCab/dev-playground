import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  //   users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  users: [{ type: String }],
});

export default mongoose.model("Room", chatRoomSchema);
