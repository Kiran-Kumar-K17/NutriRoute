import cloudinary from "../config/cloudinary.js";

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  return await cloudinary.uploader.destroy(publicId);
};
