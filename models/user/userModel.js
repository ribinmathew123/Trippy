import mongoose from "mongoose";

import userModel from '../user/userModel.js';
import vendorModel from "../vendor/VendorModel.js";
import packageModel from "../vendor/packageModel.js"


const userSchema = new mongoose.Schema({
  
  name: {
      type:String, 
      required:[true, 'Please Add Name']
  },
  image: {
    type:String, 
},
  email:{
       type: String,
       required:true,
       unique: [true, 'Please Add Email']
  },
  phoneNumber:{
       type: String,
       required: [true, 'Please Add Phone Number']
  },
  password: {
      type: String,
      required:[true, 'Please Add Password']
  },
  isBlocked:{
      type:Boolean,
      required:true,
      default:false
  },
  isVerified:{
    type:Boolean,
    required:true,
    default:false
},
  
}, {timestamps: true})
const User = mongoose.model("User", userSchema);

export default User;
