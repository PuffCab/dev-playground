import express from "express";
import { imageUpload, registerNewUser } from "../controller/usersController.js";
import multerUpload from "../middleware/multer.js";
const userRouter = express.Router();

userRouter.post("/uploadImage", multerUpload.single("image"), imageUpload);
// userRouter.post("/uploadImage", imageUpload);
userRouter.post("/register", registerNewUser);

export default userRouter;
