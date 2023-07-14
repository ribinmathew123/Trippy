import mongoose from "mongoose";
import userModel from '../user/userModel.js';
import vendorModel from "../vendor/VendorModel.js";
import packageModel from "../vendor/packageModel.js"


const orderSchema = new mongoose.Schema({

vendorId: {
  type: mongoose.SchemaTypes.ObjectId,
  ref: "Vendor",
},
packageId: {
  type: mongoose.SchemaTypes.ObjectId,
  ref: "Package",
},

userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
},
orderId: {
      type:String, 
    //   required:[true, 'Please Add Name']
  },

  packageName: {
        type: String,
        // required: [true, 'Please Add Type']
    },


    packageDetails: {
        type: String,
        // required: [true, "Please Add district"]
    },
    startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      amount: {
        type: Number,
      },

dateOfPayment:{
  type:Date,
  default:Date
},
totalMember: {
  type: Number,
},

price: {
  type: Number,
},
      

    isBlocked: {
        type: Boolean,
        required: true,
        default: false
    },
}, {timestamps: true})

const Order = mongoose.model("Order", orderSchema);

export default Order;
