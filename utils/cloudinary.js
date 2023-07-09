import { v2 as config, uploader } from 'cloudinary'

const cloudinaryConfig = (req, res, next) => {
  config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
    // sign_url: process.env.CLOUDINARY_URL,
  });
  next();
};

module.exports = {
  cloudinaryConfig,
  uploader,
};


