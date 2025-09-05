import fs from "fs";
import path from "path";

type FolderName = "customers" | "products" | "categories" | "proofTransactions";

export const unlinkImage = (folderName: FolderName, fileName: string | null | undefined) => {
  if (!fileName) return false;

  const pathImage = path.join(__dirname, "../../public/images");
  const result = path.join(pathImage, folderName, fileName);

  fs.unlink(result, (err) => {
    if (err) {
      console.log(`error unlink image: ${err}`);
    }
  });
};
