import User from "../../models/user/userModel.js";
import Package from "../../models/vendor/packageModel.js";
import Place from "../../models/admin/placeModel.js";
import orderModel from "../../models/payment/paymentModel.js";
import Review from "../../models/review/reviewModel.js";

import asyncHandler from "express-async-handler";
import moment from "moment";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtp, verifyOtp } from "../../helpers/otpVerification.js";
import dotenv from "dotenv";
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
        .json({ error: "Please provide all required fields" });
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

    return res.status(200).json(true);
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
      });
      if (user) {
        res.status(201).json({
          _id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          token: generateAuthToken(user._id),
        });
      }
    } else {
      res.status(400);
      throw new Error("Invalid OTP");
    }
  } catch (error) {
    res.status(408).send({ message: "Internal Server Error" });
  }
};





export const forgotPasswordOtp = async (req, res) => {
  try {
    console.log(req.body);
    const { otpCode, newPassword, phoneNumber } = req.body;

    // Find the user based on the provided mobile number
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

      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};











// export const forgotPasswordOtp = async (req, res) => {
//   try {
//     console.log(req.body);
//     const {  otpCode,newPassword,phoneNumber } = req.body;

//     const otpVerify = await verifyOtp(phoneNumber, otpCode);
//     if (otpVerify.status == "approved") {
//       console.log("otp approvel ");

//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(newPassword, salt);

//       const user = await User.create({
    
//         password: hashedPassword,
//       });
//       if (user) {
//         res.status(201).json({}
//         );
//       }
//     } else {
//       res.status(400);
//       throw new Error("Invalid OTP");
//     }
//   } catch (error) {
//     res.status(408).send({ message: "Internal Server Error" });
//   }
// };











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
  const { searchkey, price, startDate } = req.body;
  console.log(req.body);

  if (!searchkey || !price || !startDate) {
    return res.status(400).json({ error: "Please fill in all fields." });
  }

  try {
    const [minPrice, maxPrice] = price.split("-");
    const formattedStartDate = moment(startDate).format("YYYY-MM-DD");

    const existsData = await Package.find({
      $or: [
        { district: { $regex: searchkey, $options: "i" } },
        { places: { $regex: searchkey, $options: "i" } },
      ],
      price: { $gte: minPrice, $lte: maxPrice },
      startDate: { $lte: new Date(formattedStartDate + "T23:59:59Z") },
    }).exec();

    if (existsData.length === 0) {
      console.log("no matching data");
      return res.status(404).json({ error: "No matching data found." });
    }

    res.json(existsData);
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

    const currentDate = new Date();

    const packages = await Package.find({
      offer: parseInt(offer),
      offerEndDate: { $gte: currentDate },
    });

    res.json(packages);
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
  console.log("ggggggg");
  console.log(packageId);

try {
  const matchingPackages = await Package.find({ _id: packageId}).populate("vendorId")

   console.log(matchingPackages);
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

    // Create filter object
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
  console.log("orderssssssssssssss");

  const userId = req.params.userId;
  console.log(userId);

  try {
    const orders = await orderModel
      .find({ userId: userId })
      .sort({ createdAt: -1 });
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
      .sort({ createdAt: -1 });
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
  console.log("111111111111111");
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


// reviews

// export const postUserReviews = async (req, res) => {
//   console.log("review data coming.......");
//   try {
//     const { userId, packageId, rating, description } = req.body;
//     console.log('====================================');
//     console.log(req.body);
//     console.log('====================================');
//     const review = new Review({ userId, packageId, rating, description });
//     await review.save();
//     res.status(201).json(review);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
export const postUserReviews = async (req, res) => {
  try {
    const { userId, packageId, rating, description } = req.body;
    
    // Check if the user has already submitted a review for the package
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
  console.log("gggggg");
  try {
    const { packageId } = req.params;
    console.log(packageId);

    const reviews = await Review.find({ packageId }).populate('userId');

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










export {
  userSignup,
  searchPackage,
  otpVerification,
  userLogin,
  getTousistPackage,
  getPlace,
};
