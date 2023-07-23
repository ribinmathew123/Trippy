import User from "../../models/user/userModel.js";
import Package from "../../models/vendor/packageModel.js";
import Place from "../../models/admin/placeModel.js";
import orderModel from "../../models/payment/paymentModel.js";
import Review from "../../models/review/reviewModel.js";
import { OAuth2Client } from "google-auth-library";


import Vendor from "../../models/vendor/VendorModel.js";

import Packages from "../../models/vendor/packageModel.js";
import asyncHandler from "express-async-handler";
import moment from "moment";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtp, verifyOtp } from "../../helpers/otpVerification.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const userLogin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (user) {
      if (user.isBlocked === true) {
        res.status(400).json({ message: "Your account has been blocked!" });
      } else {
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (isPasswordCorrect) {
          res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isVerified:user.isVerified,
            image:user.image,
            phoneNumber: user.phoneNumber,
            token: generateAuthToken(user._id),
          });
        } else {
          res.status(400).json({ message: "Incorrect password" });
        }
      }
    } else {
      res.status(400).json({ message: "Incorrect email" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});








const userSignup = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    console.log("data", name, email, phoneNumber, password);

    if (!name || !email || !phoneNumber || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const userExistsByEmail = await User.findOne({ email });
    const userExistsByPhoneNumber = await User.findOne({ phoneNumber });

    if (userExistsByEmail) {
      console.log("User with this email already exists");
      return res.status(400).json({ message: "User with this email already exists" });
    }

    if (userExistsByPhoneNumber) {
      console.log("phone number already used");
      return res.status(400).json({ message: "User with this phone number already exists" });

    }

    const otpSend = await sendOtp(phoneNumber);
    if (!otpSend) {
      return res.status(500).json({ error: "Failed to send OTP" });
    }

    return res.status(200).json({message:"otp sent success"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};





const otpVerification = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, otpCode } = req.body;
    console.log("data ");
    const otpVerify = await verifyOtp(phoneNumber, otpCode);
    if (otpVerify.status == "approved") {
      console.log("otp approvel ");

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        isVerified:true
      });
      if (user) {
        res.status(201).json({
          _id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          isVerified:user.isVerified,
          token: generateAuthToken(user._id),
        });
      }
    } else {
      return res.status(400).json({ message: "Invalid OTP" });

      // throw new Error("Invalid OTP");
    }
  } catch (error) {
    res.status(408).send({ message: "Internal Server Error" });
  }
};


export const resendOtp=async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    console.log("number",phoneNumber);

    if (!phoneNumber) {
      return res.status(400).json({ error: "Please provide a phone number" });
    }

    const otpSend = await sendOtp(phoneNumber);
    if (!otpSend) {
      return res.status(500).json({ error: "Failed to send OTP" });
    }

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};





export const forgotPasswordOtp = async (req, res) => {
  try {
   
    const { otpCode, newPassword, phoneNumber } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }


    const otpVerify = await verifyOtp(phoneNumber, otpCode);

    if (otpVerify.status === "approved") {
      console.log("OTP approved");

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await user.save();

      console.log("Password updated successfully");
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      console.log("Invalid OTP");

      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const generateAuthToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "10d" });
};





export const forgotPassword = async (req, res) => {
  try {
    const {  phoneNumber} = req.body;
    console.log("data",phoneNumber);

    if (!phoneNumber) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const userExists = await User.findOne({ phoneNumber });
console.log("userinfo",userExists);

    if (!userExists) {
      console.log("no user found");
      return res.status(400).json({ message: "No user found " });
    }

    const otpSend = await sendOtp(phoneNumber);
    if (!otpSend) {
      return res.status(500).json({ error: "Failed to send OTP" });
    }

    return res.status(200).json(true);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};





const searchPackage = async (req, res) => {
  const { searchKey, price, startDate, page } = req.body;
  const itemsPerPage = 8;

  if (!searchKey || !price || !startDate) {
    return res.status(400).json({ error: "Please fill in all fields." });
  }

  try {
    const [minPrice, maxPrice] = price.split("-");
    const formattedStartDate = moment(startDate).format("YYYY-MM-DD");

    const count = await Package.countDocuments({
      $or: [
        { district: { $regex: searchKey, $options: "i" } },
      ],
      price: { $gte: minPrice, $lte: maxPrice },
      startDate: { $lte: new Date(formattedStartDate + "T23:59:59Z") },
    });

    const totalPages = Math.ceil(count / itemsPerPage);
    const skip = (page - 1) * itemsPerPage;

    const existsData = await Package.find({
      $or: [
        { district: { $regex: searchKey, $options: "i" } },

      ],
      price: { $gte: minPrice, $lte: maxPrice },
      startDate: { $lte: new Date(formattedStartDate + "T23:59:59Z") },
    })
      .skip(skip)
      .limit(itemsPerPage)
      .exec();

    if (existsData.length === 0) {
      console.log("no matching data");
      return res.status(404).json({ error: "No matching data found." });
    }

    res.json({ existsData, totalPages });
    console.log("existsData", existsData);
  } catch (err) {
    console.log("Error querying MongoDB:", err);
    return res
      .status(500)
      .json({ error: "An error occurred. Please try again later." });
  }
};




export const offerPackage = async (req, res) => {
  try {
    const offer = req.params.offerPercentage;
    const { search, sortBy, sortOrder, page, pageSize } = req.query;

    const filter = {
      isBlocked: false,
      offer: parseInt(offer),
    };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const totalCount = await Package.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    const currentDate = new Date();

    const packages = await Package.find({
      ...filter,
      offerEndDate: { $gte: currentDate },
    })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const savedPrice = packages[0].price * (parseInt(offer) / 100);
    const offerPrice = packages[0].price - savedPrice;
    const roundedOfferPrice = Math.round(offerPrice * 100) / 100;
    res.json({ packages, savedPrice, roundedOfferPrice });
    console.log("packages", packages);
  } catch (err) {
    console.log("Error querying MongoDB:", err);
    return res
      .status(500)
      .json({ error: "An error occurred. Please try again later." });
  }
};








const getTousistPackage = async (req, res) => {
  try {
    const { search, sortBy, sortOrder, page, pageSize } = req.query;

    const filter = {
      isBlocked: false,
    };

    if (search) {
      filter.Packages = { $regex: search, $options: "i" };
    }

    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const totalCount = await Package.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    const packages = await Package.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({ packages, totalCount, totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getPackage = asyncHandler(async (req, res) => {
  const packageId = req.params.packageId;

try {
  const matchingPackages = await Package.find({ _id: packageId}).populate("vendorId")

  res.status(200).json(matchingPackages);
} catch (error) {
  res.status(408).send({ message: "Internal Server Error" });
}
});






const getPlace = asyncHandler(async (req, res) => {
  try {
    const Allplace = await Place.find({ isBlocked: false }).sort({
      createdAt: -1,
    });
    if (Allplace) {
      res.status(200).json(Allplace);
    } else {
      res.status(400);
      throw new Error("Something went wrong!");
    }
  } catch (error) {
    console.log(error);
  }
});







export const getActions = async (req, res) => {
  try {
    const { search, sortBy, sortOrder, page, pageSize } = req.query;

    const filter = {
      isBlocked: false,
    };

    if (search) {
      filter.place = { $regex: search, $options: "i" };
    }

    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    // Calculate skip and limit for pagination
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const totalCount = await Place.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    const places = await Place.find(filter).sort(sort).skip(skip).limit(limit);

    res.status(200).json({ places, totalCount, totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const orderDetails = async (req, res) => {

  const userId = req.params.userId;

  try {
    
    const orders = await orderModel
      .find({ userId: userId })
      .sort({ createdAt: -1 }).populate("vendorId", "-password").populate("packageId", "-password")
    console.log(orders);
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for the user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};




export const orderSuccess = async (req, res) => {
  const orderId = req.params.orderId;
  console.log(orderId);

  try {
    const orders = await orderModel
      .find({ _id: orderId })
      .sort({ createdAt: -1 })
    console.log(orders);
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for the user" });
    }

    res.status(200).json(orders[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const aboutPlace = async (req, res) => {
  const placeId = req.params.placeId;

  try {
    const placeDate = await Place
      .find({ _id: placeId })
    if (placeDate.length === 0) {
      return res.status(404).json({ message: "No  Place data found " });
    }

    res.status(200).json(placeDate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const searchRelatedPack = async (req, res) => {
  const placeId = req.params.placeId;
  console.log(placeId);

  try {
    const relatedPackages = await Package.find({ "place._id": placeId });

    console.log(relatedPackages);

    if (relatedPackages.length === 0) {
      return res.status(404).json({ message: "No related packages found" });
    }

    res.status(200).json(relatedPackages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};






export const postUserReviews = async (req, res) => {
  try {
    const { userId, packageId, rating, description } = req.body;
    
    const existingReview = await Review.findOne({ userId, packageId });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already submitted a review for this package.' });
    }
    
    const review = new Review({ userId, packageId, rating, description });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// Get reviews for a specific package
export const getPackageReviews = async (req, res) => {
  try {
    const { packageId } = req.params;
    console.log("package id is coming",packageId);

    const reviews = await Review.find({ packageId }).populate('userId');
console.log("find review");
console.log(reviews);

console.log("find review");



    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// Delete a review
export const deleteUserReviews = async (req, res) => {

  try {
    const reviewId = req.params.id;
    await Review.findByIdAndDelete(reviewId);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Update a review
export const UpdateUserReviews= async (req, res) => {
  console.log("data coming");
  try {
    const { id } = req.params;
    const { description } = req.body;

    const review = await Review.findByIdAndUpdate(id, { description }, { new: true });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



export const getUserInfo = asyncHandler(async (req, res) => {

  const userId = req.params.userId;

try {
  const userInfo = await User.findById(userId).select('-password');


  res.status(200).json(userInfo);
} catch (error) {
  res.status(408).send({ message: "Internal Server Error" });
}
});



export const userProfileImage = asyncHandler(async (req, res) => {
  const { userId } = req.params;
 
  if (!req.file) {

    return res.status(400).json({ error: 'No image file provided' });
  }


  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { image: req.file.path },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({ message: 'Profile image updated successfully', user: updatedUser });
});





export const changePassword = async (req, res) => {
  const saltRounds = 10;
  const { userId } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update password' });
  }
};



// googleLogin
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleLogin = (req, res) => {
 
  const { idToken } = req.body;

  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      const { email_verified, name, email } = response.payload;

      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "10d"
            });
            const { _id, email, name } = user;
            return res.json({
              token,
              user: { _id, email, name }
            });
          } else {
            const password = email + process.env.JWT_SECRET;

            user = new User({ name, email, password });
            user
              .save((err, data) => {
                if (err) {
                  return res.status(400).json({
                    error: "User signup failed with google"
                  });
                }
                const token = jwt.sign(
                  { _id: data._id },
                  process.env.JWT_SECRET,
                  { expiresIn: "10d" }
                );
                const { _id, email, name } = data;

                return res.json({
                  token,
                  user: { _id, email, name }
                });
              })
              .catch((err) => {
                return res.status(401).json({
                  message: "signup error"
                });
              });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again"
        });
      }
    });
};











export const signupWithGmail = asyncHandler(async (req, res) => {
  console.log("signupdata");
  const googleTOken = req.body.googleToken;
  console.log(googleTOken);
  if (!googleTOken) {
      res.status(400).json({
          status: false,
          message: "missing google token"
      })
  }
  const payload = await (await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleTOken}`)).data
  console.log("payload",payload);
  if (payload) {
      const existedUser  = await User.findOne({ email: payload.email })
      if (!existedUser) {
console.log("new user");
        const salt = await bcrypt.genSalt(10);
        console.log("salt",salt);
        const hashedPassword = await bcrypt.hash(payload.sub, salt);
        console.log("password",hashedPassword);
          const user = new User({
              name: payload.name,
              email: payload.email,
              isSignupWithGoogle: true,
              password: hashedPassword,
              isVerified: payload.email_verified
          })
          console.log("save ");
          user.save()
          const token = await generateAuthToken(user._id)
          res.json({
              status: true,  message: "Login Success",

              user: {...user._doc, token}
          })
      } else {
        console.log("already signup with email please login");
          res.status(406).json({ status: false, message: "already signup with email please login" })
      }
  }

})







export const loginWithGoogle = asyncHandler(async (req, res) => {

  const googleTOken = req.query.googleToken;
  console.log(googleTOken);

  if (!googleTOken) {
      res.status(400).json({
          status: false,
          message: "missing google token"
      })
  }
  const payload = await (await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleTOken}`)).data
  if (payload) {
      const existedUser = await User.findOne({ email: payload.email })
      if (existedUser) {
          const passwordStatus = await bcrypt.compare(payload.sub,existedUser.password);

          if (passwordStatus) {
              const token = await generateAuthToken( existedUser._id,)
              res.json({
                  status: true,
                  user: {...existedUser._doc, token}
              })
          }
      } else {
          res.status(404).json({ status: false, message: "user not exist" })
      }
  }

}
)




export {
  userSignup,
  searchPackage,
  otpVerification,
  userLogin,
  getTousistPackage,
  getPlace,
};
