import { resolve } from "dns";
import cloudinary from "../../config/cloudinary.js";
import fs from "fs";

export const uploadFileService = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "teamflow",
        resource_type: "auto",
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );
    stream.end(file.buffer);
  });
};
