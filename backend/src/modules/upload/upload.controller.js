import { uploadFileService } from "./upload.service.js";

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("No file uploaded");
      error.statusCode = 400;
      return next(error);
    }

    const result = await uploadFileService(req.file);

    res.status(200).json({
      success: true,
      message: "File uploaded",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
