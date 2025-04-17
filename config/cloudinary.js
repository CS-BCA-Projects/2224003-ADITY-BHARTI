const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary=async (localFilePath)=>{
  try {
      console.log('Local file path --',localFilePath)
      if (!localFilePath) {
          console.log("Local file path not found")
          return null;
      } 
      else {
        console.log("Local file path found");
        console.log(localFilePath);
          // Uploading file to Cloudinary

          const uploadresult=await cloudinary.uploader.upload(
              localFilePath,{
                  resource_type:'auto',
                  access_mode: 'public'
              }
          )
          fs.unlinkSync(localFilePath);//to delete file from server
          console.log("File has uploaded ",uploadresult.url);
          return uploadresult
      }
  } catch (error) {
      console.log("Failed to upload on Cloudinary")
      fs.unlinkSync(localFilePath);//to delete file from server
      return null;
  }
}
const deleteOnCloudinary=async (publicId)=>{
  try {
      if (!publicId) {
          return null;
      } 
      else {
          const deleteresult=await cloudinary.uploader.destroy(publicId)
          console.log("File has deleted ",deleteresult);  
          return deleteresult
      }
  }
  catch (error) {
      return null;
  }   
}
module.exports = uploadOnCloudinary;
