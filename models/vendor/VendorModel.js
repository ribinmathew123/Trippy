import mongoose from "mongoose";
import packageModel from "./packageModel.js"; 

const vendorSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: [true, 'Please Add Name'],
  },
  email: {
    type: String,
    required: [true, 'Please Add Email'],
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please Add Phone Number'],
  },
  password: {
    type: String,
    required: [true, 'Please Add Password'],
  },
  isBlocked: {
    type: Boolean,
    required: true,
    default: false,
  },
  isVerified:{
    type:Boolean,
    required:true,
    default:false
},
image: {
  type:String, 
},
}, { timestamps: true });

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
