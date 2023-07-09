import mongoose from "mongoose";



const reviewSchema = new mongoose.Schema({

   

packageId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "packageModel",
},

userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
// userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel' },


rating: {
        type: Number,
        // required: [true, 'Please Add Type']
    },


    description: {
        type: String,
        // required: [true, "Please Add district"]
    },

      

  
}, {timestamps: true})
const Review = mongoose.model('Review', reviewSchema);



export default Review;
