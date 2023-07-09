import express from "express";
import {
  addPackage, getTousistPackage, deletePackage, fetchPackage,editPackage, blockAndUnblockPackage,
  getCategory,deleteCategory,TousistPackage,editCategory,blockAndUnblockCategory,dashBoardGraph,
  vendorSignup, otpVerification, vendorLogin, bookDetails, dashboardData, getPlace, category,
} from "../../controllers/vendorController/vendorController.js";
import { vendorProtect } from "../../Middleware/middleware.js";
import uploadImage from "../../config/cloudinary.js";

const vendorRoute = express.Router();

vendorRoute.post("/signup", vendorSignup);
vendorRoute.post("/login", vendorLogin);
vendorRoute.post("/otp", otpVerification);


//package
vendorRoute.get("/getPackage/:id", getTousistPackage);

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
vendorRoute.get("/bookDetails/:id",vendorProtect, bookDetails);
vendorRoute.get("/dashboardDetails/:id", vendorProtect,dashboardData);
vendorRoute.get("/dashboard/:id",vendorProtect, dashBoardGraph);

export default vendorRoute;
