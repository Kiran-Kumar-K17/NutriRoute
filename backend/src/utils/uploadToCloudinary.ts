import cloudinary from "../config/cloudinary.js";
import { UploadApiResponse } from "cloudinary";

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) {
            return reject(new Error("Upload failed"));
          }
          resolve(result);
        },
      )
      .end(fileBuffer);
  });
};
