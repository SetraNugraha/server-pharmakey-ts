import multer from "multer";
import { Request } from "express";
import cloudinary from "../config/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const uploadToCloudinary = (folderPath: string) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
      folder: `pharmakey/${folderPath}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    }),
  });

  return multer({
    storage,
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

export const uploadCategoryImage = uploadToCloudinary("categories");
export const uploadProductsImage = uploadToCloudinary("products");
export const uploadCustomersImage = uploadToCloudinary("customers");
export const uploadProofTransactionsImage = uploadToCloudinary("proofTransactions");
