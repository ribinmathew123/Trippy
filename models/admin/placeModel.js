import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  
    place: {
      type:String, 
    //   required:[true, 'Please Add Name']
  },

  type: {
        type: String,
        // required: [true, 'Please Add Type']
    },
    
    district: {
        type: String,
        // required: [true, "Please Add district"]
    },
   
  
    description: {
        type: String,
        // required: [true, "Please Add Description"]
    },
    city: {
        type: String,
        // required: [true, "Please Add Description"]
    },
    email:{
        type: String,
   },
   phoneNumber:{
        type: String,
   },
    image:[ {
        
        public_id:{
                   type: String,
                    required: true
                   },
        url:{
        type: String,
        required: true
    },
          
    }],

    // image: {
    //      type:Array

    //     // public_id:{
    //     //            type: String,
    //     //             required: true
    //     //            },
    //     // url:{
    //     // type: String,
    //     // required: true
    // },
          




    isBlocked: {
        type: Boolean,
        required: true,
        default: false
    },
}, {timestamps: true})

const Place = mongoose.model("Place", placeSchema);

export default Place;
