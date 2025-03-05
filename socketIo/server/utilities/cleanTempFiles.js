import fs from "fs";

const cleanTempFiles = (file) => {
  //   console.log("file :>> ", file);
  console.log("cleaning file :>> ", file.path);
  if (file instanceof File) {
    fs.unlink(file.path, function (err) {
      if (err) throw err;
      console.log("path/file.txt was deleted");
    });
  }
};
export default cleanTempFiles;
