const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Upload function
const uploadOnCloudinary = async (localFilePath) => {
  try {
    console.log('Local file path --', localFilePath);
    if (!localFilePath) {
      console.log("❌ Local file path not found");
      return null;
    }

    const ext = path.extname(localFilePath).toLowerCase();
    const isPDF = ext === '.pdf';

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: isPDF ? 'raw' : 'image',
      access_mode: 'public',
      folder: 'uploads'
    });

    fs.unlinkSync(localFilePath); // Clean local file
    console.log("✅ File has uploaded:", uploadResult.url);
    return uploadResult;

  } catch (error) {
    console.log("❌ Failed to upload on Cloudinary:", error.message);
    fs.existsSync(localFilePath) && fs.unlinkSync(localFilePath); // Safe delete
    return null;
  }
};

// ✅ Delete function
const deleteOnCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;

    const deleteResult = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'auto'
    });

    console.log("🗑️ File has deleted:", deleteResult);
    return deleteResult;

  } catch (error) {
    console.error("❌ Delete failed:", error.message);
    return null;
  }
};

module.exports = uploadOnCloudinary;
