import express from "express"

import { adminProtect } from "../../Middleware/middleware.js";
import uploadImage from "../../config/cloudinary.js";

import { adminLogin,getPlace,getAllVendor, blockAndUnblockVendor,getAllUser,blockAndUnblockUser,displayDashboardData,displayCharts,
    addPlace,deletePlace,editPlace,blockAndUnblockPlace,fetchPlace} from '../../controllers/adminController/adminController.js';

const adminRoute = express.Router();




// user
adminRoute.get('/users',adminProtect,getAllUser)
adminRoute.post('/login', adminLogin);
adminRoute.put('/users',adminProtect, blockAndUnblockUser)


// vendor
adminRoute.get('/vendors',adminProtect,getAllVendor)
adminRoute.put('/vendors',adminProtect, blockAndUnblockVendor)


// touristPlace
adminRoute.get('/places',getPlace)
adminRoute.post('/places',adminProtect,uploadImage,addPlace)
adminRoute.delete('/places',adminProtect, deletePlace)
adminRoute.post('/update-place', adminProtect, uploadImage,editPlace);
adminRoute.get('/places/:id', adminProtect, fetchPlace);
adminRoute.put('/places', adminProtect, blockAndUnblockPlace)


// DashBoard
adminRoute.get('/dashboard', displayDashboardData)
adminRoute.get('/charts', displayCharts)


export default adminRoute;
