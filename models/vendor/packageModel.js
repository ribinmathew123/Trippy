import mongoose from "mongoose";
import Vendor from "./VendorModel.js"; 
const packageSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    
    vendorName: {
      type: String
    },

    name: {
      type: String,
      //   required:[true, 'Please Add Name']
    },
    price: {
      type: Number,
    },

    district: {
      type: String,
      // required: [true, "Please Add district"]
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
   

    tourPlan: [
      {
        totalDay: String,
        title: String,
        description: String,
        subtitle: String,
        totalTime: String
      }
    ],
    
    place: {
      type: Array,
    },

    details: {
      type: String,
      // required: [true, "Please Add Description"]
    },

    day: {
      type: Number,
    },
    night: {
      type: Number,
    },

    image: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    // categoryId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "CategoryModel",
    // },
categoryId:{
  type:String
},
categoryName:{
  type:String
},



// offer:{
//   type:Number,
//   default:"No Offer"
// },



offer: {
  type: Number,
  default: null,
  get: (value) => (value === null ? "No Offer" : value.toString()),
},

offerEndDate:{
  type:Date,
},


    isBlocked: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

export default Package;
