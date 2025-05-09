import multer from "multer";
import path from "path";
import colors from "colors";

const storage = multer.diskStorage({});
const limits = { fileSize: 5 * 1024 * 1024 }; // Handling file size directly in Multer
const fileFilter = (req, file, cb) => {
  console.log("file :>> ", file);
  //check the file extension to decide if we allow upload or not
  let extension = path.extname(file.originalname);
  if (extension !== ".png" && extension !== ".jpg" && extension !== ".jpeg") {
    console.log("File extension not supported".red);
    // To reject this file pass `false`, like so:
    cb(null, false);
    // cb(
    //   new Error(
    //     `you are trying to upload a ${extension} file. Only images are supported`
    //   )
    // );
  } else {
    // To accept the file pass `true`, like so:
    console.log("file accepted");
    cb(null, true);
  }

  // // You can always pass an error if something goes wrong:
  // cb(new Error("I don't have a clue!"));
};

const multerUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

export default multerUpload;
