import claudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string,
) => {
  return new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      const stream = claudinary.uploader.upload_stream(
        {
          folder,
        },
        (error, result) => {
          if (error) {
            reject(error);
          }
          if (!result) {
            return reject(new Error("Cloudinary upload failed."));
          }
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );
      stream.end(file.buffer);
    },
  );
};
