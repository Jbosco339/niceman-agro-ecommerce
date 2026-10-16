import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

const config = {};

if (process.env.CLOUDINARY_CLOUD_NAME) {
    config.cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
}
if (process.env.CLOUDINARY_API_KEY) {
    config.api_key = process.env.CLOUDINARY_API_KEY;
}
if (process.env.CLOUDINARY_API_SECRET) {
    config.api_secret = process.env.CLOUDINARY_API_SECRET;
}

cloudinary.config(config);

export const missingCloudinaryConfiguration = () =>
    ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]
        .filter((key) => !process.env[key]?.trim());

export default cloudinary;
