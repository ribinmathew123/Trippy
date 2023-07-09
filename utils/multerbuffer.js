
import { v2 as cloudinary } from 'cloudinary'

import { CloudinaryStorage } from 'multer-storage-cloudinary'

import multer from 'multer'

import path from 'path'

const cloudstorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "TRIPPY",
    },
  });
  const upload = multer({ storage: cloudstorage});

  
export default upload