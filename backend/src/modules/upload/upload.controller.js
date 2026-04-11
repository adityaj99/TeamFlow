import { uploadFileService } from "./upload.service.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    const result = await uploadFileService(req.file);

    res.status(200).json({
      success: true,
      message: "File uploaded",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
