import express from "express";
import {
  addPackage, getTousistPackage, deletePackage, fetchPackage,editPackage, blockAndUnblockPackage,forgotPasswordOtp,
  getCategory,deleteCategory,TousistPackage,editCategory,blockAndUnblockCategory,dashBoardGraph,
  forgotPassword,vendorProfileImage,vendorSignup, otpVerification, vendorLogin, bookDetails, dashboardData, 
  getPlace, category,resendOtp,getVendorInfo,
} from "../../controllers/vendorController/vendorController.js";
import { vendorProtect } from "../../Middleware/middleware.js";
import uploadImage from "../../config/cloudinary.js";

const vendorRoute = express.Router();

vendorRoute.post("/signup", vendorSignup);
vendorRoute.post("/login", vendorLogin);
vendorRoute.post("/otp", otpVerification);
vendorRoute.post('/resend-otp', resendOtp);
vendorRoute.post('/forgotPassword', forgotPassword);
vendorRoute.post('/verifyOtp', forgotPasswordOtp);



//package
vendorRoute.get("/getPackage/:id", vendorProtect,getTousistPackage);

vendorRoute.get("/packages", TousistPackage);

vendorRoute.post("/packages", vendorProtect, uploadImage, addPackage);

vendorRoute.delete("/packages", vendorProtect, deletePackage);

vendorRoute.get("/fetchPackage/:id", vendorProtect, fetchPackage);
vendorRoute.post("/update-packages", vendorProtect, uploadImage, editPackage);
vendorRoute.put("/packages",vendorProtect,blockAndUnblockPackage);


//category
vendorRoute.get("/getCategory",vendorProtect, getCategory);
vendorRoute.post("/addCategory", vendorProtect, category);
vendorRoute.delete("/deleteCategory", vendorProtect, deleteCategory);
vendorRoute.put("/editCategory", vendorProtect, editCategory);
vendorRoute.put("/blockAndUnblockCategory",vendorProtect,blockAndUnblockCategory);


vendorRoute.get("/place", vendorProtect, getPlace);
vendorRoute.get("/bookDetails/:id", vendorProtect,bookDetails);
vendorRoute.get("/dashboardDetails/:id",vendorProtect,dashboardData);
vendorRoute.get("/dashboard/:id",vendorProtect, dashBoardGraph);

vendorRoute.post('/vendor-info/:vendorId',vendorProtect,uploadImage,vendorProfileImage)
vendorRoute.get('/vendor-info/:vendorId',vendorProtect,getVendorInfo)

export default vendorRoute;
