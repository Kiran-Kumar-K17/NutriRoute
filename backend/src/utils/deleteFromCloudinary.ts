import cloudinary from "cloudinary";
export const deleteFromCloudinary = async (publicId: string) => {
  if (!publicId) {
    throw new Error(
      "Public ID is required to delete the image from Cloudinary.",
    );
  }
  await cloudinary.v2.uploader.destroy(publicId);
};
