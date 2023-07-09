import mongoose from "mongoose";

const TourPlanSchema = new mongoose.Schema({

  Dayplan: [{
    heading:String,
    planDetails:String,     
  }], 
  
},
 {timestamps: true})

const TourPlan = mongoose.model("TourPlan", TourPlanSchema);

export default TourPlan;
