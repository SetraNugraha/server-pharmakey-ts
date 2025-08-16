import fs from "fs";
import path from "path";
import { AppError } from "../middlewares/error.middleware";

export const unlinkImage = (folderName: string, fileName: string | null | undefined) => {
  if (!fileName) return false;

  const pathImage = path.join(__dirname, "../../public/images");
  const result = path.join(pathImage, folderName, fileName);

  fs.unlink(result, (err) => {
    if (err) {
      console.log(`error unlink image: ${err}`);
    }
  });
};
