import express from "express";
import upload, { saveUpload } from "../middlewares/uploadMiddleware.js";
import auth from "../middlewares/auth.js";
import { uploadFile } from "../controllers/uploadController.js";

const Router = express.Router();

Router.route("/upload")
  .post(
    auth,
    upload.single("file"),
    saveUpload,
    uploadFile
  );

export default Router;