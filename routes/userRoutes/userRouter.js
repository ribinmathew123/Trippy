import express from 'express';

import { otpVerification,userSignup,userLogin,forgotPassword,
    forgotPasswordOtp,offerPackage,searchPackage,getTousistPackage,getPackageReviews,getPackage, UpdateUserReviews,postUserReviews,deleteUserReviews,
    aboutPlace,getPlace,orderSuccess,getActions,orderDetails,searchRelatedPack} from '../../controllers/userController/userController.js';
import {payment,confirmOrder} from '../../controllers/paymentController/paymentController.js'
import { isAuthenticated } from "../../Middleware/middleware.js";

const userRoute = express.Router(); 

userRoute.post('/signup', userSignup);
userRoute.post('/login', userLogin);
userRoute.post('/otp', otpVerification);
userRoute.post('/forgotPassword', forgotPassword);
userRoute.post('/verifyOtp', forgotPasswordOtp);


userRoute.post('/searchPackage',searchPackage)
userRoute.get('/offerPackage/:offerPercentage',offerPackage)


userRoute.get('/allPackage',getTousistPackage)
userRoute.get('/packages/:packageId',getPackage)

userRoute.get('/allPlace',getPlace)
userRoute.get('/allActions',getActions)
userRoute.post('/orders',payment)
userRoute.post('/order',confirmOrder)
userRoute.get('/orderDetails/:userId',orderDetails)
userRoute.get('/successData/:orderId',orderSuccess)
userRoute.get('/placeDetails/about/:placeId',aboutPlace)
userRoute.get('/placeDetails/relatePackage/:placeId',searchRelatedPack)


userRoute.get('/reviews/:packageId',getPackageReviews)
userRoute.post('/reviews',isAuthenticated,postUserReviews)
userRoute.delete('/reviews/:id',isAuthenticated,deleteUserReviews)
userRoute.put('/reviews/:id',isAuthenticated,UpdateUserReviews)


  





















export default userRoute;
