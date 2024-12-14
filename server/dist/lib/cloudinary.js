import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import fs from "fs";
config();
export default async function uploadOnCloudinary(localFilePath) {
    // Configuration
    cloudinary.config({
        cloud_name: "dsvnh6opu",
        api_key: "971793537566645",
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    // Upload an image
    try {
        if (!localFilePath)
            return null;
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        fs.unlinkSync(localFilePath);
        return uploadResult;
    }
    catch (error) {
        fs.unlinkSync(localFilePath);
        console.error("Error uploading file to Cloudinary:", error);
        return null;
    }
}
