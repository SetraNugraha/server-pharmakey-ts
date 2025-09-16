import multer from "multer";
import fs from "fs";
import path from "path";
import { Request } from "express";
import { AppError } from "./error.middleware";

// Check if folder already create or not
const hasImagePath = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
};

const configureMulter = (folderName: string) => {
  return multer({
    storage: multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, cb) => {
        const uploadPath = path.join(__dirname, "../../public/images", folderName);
        hasImagePath(uploadPath);
        cb(null, uploadPath);
      },
      filename: (req: Request, file: Express.Multer.File, cb) => {
        const timestamp = Date.now();
        const fileName = path.parse(file.originalname).name.toLowerCase();
        const sanitizedFileName = fileName.replace(/[^a-z0-9]/gi, "-");
        const fileExtension = path.extname(file.originalname);
        cb(null, `${sanitizedFileName}-${timestamp}${fileExtension}`);
      },
    }),
    fileFilter: (req: Request, file: Express.Multer.File, cb: (error: any, acceptedFile: boolean) => void) => {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname), false);
      }

      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // limit 5mb
  });
};

export const uploadCategoryImage = configureMulter("categories");
export const uploadProductsImage = configureMulter("products");
export const uploadCustomersImage = configureMulter("customers");
export const uploadProofTransactionsImage = configureMulter("proofTransactions");
