import UserModel from "../models/usersModel.js";
import cleanTempFiles from "../utilities/cleanTempFiles.js";
import { hashingPassword } from "../utilities/hashingPassword.js";
import uploadToCloudinary from "../utilities/imageUpload.js";

const imageUpload = async (req, res) => {
  console.log("image upload working");
  console.log("req file :>> ", req.file);
  if (!req.file) {
    return res.status(500).json({
      error: "File not supported",
    });
  }

  if (req.file) {
    //we could check the file size here (or do it directly in Multer)
    //Upload file to Cloudinary

    const uploadedImage = await uploadToCloudinary(req.file);

    if (!uploadedImage) {
      cleanTempFiles(req.file);
      return res.status(400).json({
        error: "Image couldn't be uploaded",
      });
    }
    if (uploadedImage) {
      cleanTempFiles(req.file);

      return res.status(200).json({
        message: "Image uploaded succesfully",
        imageUrl: uploadedImage.secure_url,
      });
    }
    console.log("uploadedImage :>> ".green, uploadedImage);
  }
};

const registerNewUser = async (req, res) => {
  const { userName, email, password, image } = req.body;

  // Check if user exists in database
  try {
    const existingUser = await UserModel.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists in the database",
      });
    }

    if (!existingUser) {
      // Hash the password

      const hashedPassword = await hashingPassword(password);
      if (!hashedPassword) {
        return res.status(500).json({
          error:
            "we couldnt register the user, problem with hashing the password",
        });
      }

      if (hashedPassword) {
        const newUserObject = new UserModel({
          userName: userName,
          email: email,
          password: hashedPassword,
          image: image
            ? image
            : "https://cdn-icons-png.flaticon.com/512/4123/4123763.png",
        });

        const newUser = await newUserObject.save();

        console.log("newUser :>> ", newUser);
        if (newUser) {
          return res.status(201).json({
            message: "User registered succesfully",
            user: {
              id: newUser._id,
              userName: newUser.userName,
              email: newUser.email,
              image: newUser.image,
            },
          });
        }
      }
    }
  } catch (error) {
    console.log("error :>> ", error);
    return res.status(500).json({
      error: "SOmething went wrong during register",
      errorLog: error,
    });
  }
};

export { imageUpload, registerNewUser };
