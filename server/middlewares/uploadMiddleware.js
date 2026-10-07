import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 1,
    fields: 20,
    parts: 22,
  },
  fileFilter(_req, file, callback) {
    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
    ]);
    if (!allowedTypes.has(file.mimetype)) {
      const error = new Error("Unsupported upload file type");
      error.statusCode = 400;
      return callback(error);
    }
    return callback(null, true);
  },
});

export const saveUpload = (req, res, next) => {
  if (!req.file) return next();

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "mern_uploads",
      resource_type: "auto",
      allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "mp4", "mov", "avi"],
    },
    (error, result) => {
      if (error) return next(error);
      req.file.path = result.secure_url;
      req.file.secure_url = result.secure_url;
      req.file.filename = result.public_id;
      req.file.resource_type = result.resource_type;
      return next();
    }
  );
  uploadStream.end(req.file.buffer);
};

export default upload;