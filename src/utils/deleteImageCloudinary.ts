import cloudinary from "../config/cloudinary";
import { AppError } from "../middlewares/error.middleware";

export const deleteImageCloudinary = async (image_public_id?: string) => {
  if (!image_public_id?.trim()) return null;

  try {
    const result = await cloudinary.uploader.destroy(image_public_id);

    if (result.result !== "ok" && result.result !== "not found") {
      throw new AppError("Failed to delete image from cloudinary", 500);
    }

    return result;
  } catch (error) {
    throw new AppError("Error while deleting image from cloudinary", 500);
  }
};
