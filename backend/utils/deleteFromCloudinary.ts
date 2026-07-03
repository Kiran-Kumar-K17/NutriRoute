import cloudinary from "../config/cloudinary.js";

export const deleteFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};
