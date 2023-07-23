import Package from "../../models/vendor/packageModel.js";
import cloudinary from "../../config/cloudinary.js";
import asyncHandler from "express-async-handler";
import Place from "../../models/admin/placeModel.js";
import User from "../../models/user/userModel.js";
import Vendor from "../../models/vendor/VendorModel.js";
import OrderModel from "../../models/payment/paymentModel.js";
import mongoose from 'mongoose';
import Category from "../../models/vendor/CategoryModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtp, verifyOtp } from "../../helpers/otpVerification.js";
import dotenv from "dotenv";

dotenv.config();

// export const vendorLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const vendor = await Vendor.findOne({ email: email });

//     if (vendor) {
//       if (vendor.isBlocked === true) {
//         res.status(400).json({ message: "Your account has been blocked!" });
//       } else {
//         const isPasswordCorrect = await bcrypt.compare(
//           password,
//           vendor.password
//         );
//         if (isPasswordCorrect) {
//           res.status(200).json({
//             _id: vendor.id,
//             name: vendor.name,
//             email: vendor.email,
//             phoneNumber: vendor.phoneNumber,
//             token: generateAuthToken(vendor._id),
//           });
//         } else {
//           res.status(400).json({ message: "Incorrect password" });
//         }
//       }
//     } else {
//       res.status(400).json({ message: "Incorrect email" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };








// export const vendorSignup = async (req, res) => {
//   console.log("vendor data comingkkkkkkkk");
//   try {
//     const { name, email, phoneNumber, password } = req.body;

//     if (!name || !email || !phoneNumber || !password) {
//       return res
//         .status(400)
//         .json({ error: "Please provide all required fields" });
//     }

//     const userExists = await Vendor.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     const otpSend = await sendOtp(phoneNumber);
//     if (!otpSend) {
//       return res.status(500).json({ error: "Failed to send OTP" });
//     }

//     return res.status(200).json(true);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };



// export const otpVerification = async (req, res) => {
//   try {
//     const { name, email, password, phoneNumber, otpCode } = req.body;
//     const otpVerify = await verifyOtp(phoneNumber, otpCode);
//     if (otpVerify.status == "approved") {
//       console.log("otp approvel ");

//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);
//       const vendor = await Vendor.create({
//         name,
//         email,
//         phoneNumber,
//         password: hashedPassword,
//         isVerified:true

//       });

//       if (vendor) {
//         res.status(201).json({
//           _id: vendor.id,
//           name: vendor.name,
//           email: vendor.email,
//           phoneNumber: vendor.phoneNumber,
//           isVerified:vendor.isVerified,
//           token: generateAuthToken(vendor._id),
//         });
//       }
//     } else {
//       res.status(400);
//       throw new Error("Invalid OTP");
//     }
//   } catch (error) {
//     res.status(408).send({ message: "Internal Server Error" });
//   }
// };

// const generateAuthToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "10d" });
// };





export const vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email: email });

    if (vendor) {
      if (vendor.isBlocked === true) {
        res.status(400).json({ message: "Your account has been blocked!" });
      } else {
        const isPasswordCorrect = await bcrypt.compare(password, vendor.password);
        if (isPasswordCorrect) {
          res.status(200).json({
            _id: vendor.id,
            name: vendor.name,
            email: vendor.email,
            isVerified:vendor.isVerified,
            phoneNumber: vendor.phoneNumber,
            token: generateAuthToken(vendor._id),
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
};






export const vendorSignup = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    console.log("data", name, email, phoneNumber, password);

    if (!name || !email || !phoneNumber || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const userExistsByEmail = await Vendor.findOne({ email });
    const userExistsByPhoneNumber = await Vendor.findOne({ phoneNumber });

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





export const otpVerification = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, otpCode } = req.body;
    console.log("vendorrrrr ");
    const otpVerify = await verifyOtp(phoneNumber, otpCode);
    if (otpVerify.status == "approved") {
      console.log("otp approvel ");

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const vendor = await Vendor.create({
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        isVerified:true
      });
      if (vendor) {
        res.status(201).json({
          _id: vendor.id,
          name: vendor.name,
          email: vendor.email,
          phoneNumber: vendor.phoneNumber,
          isVerified:vendor.isVerified,
          token: generateAuthToken(vendor._id),
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

    const vendor = await Vendor.findOne({ phoneNumber });
    if (!vendor) {
      res.status(404).json({ message: "User not found" });
      return;
    }


    const otpVerify = await verifyOtp(phoneNumber, otpCode);

    if (otpVerify.status === "approved") {
      console.log("OTP approved");

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      vendor.password = hashedPassword;
      await vendor.save();

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

    const userExists = await Vendor.findOne({ phoneNumber });
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







export const addPackage = async (req, res, next) => {
  try {
    const {
      name,
      price,
      disname,
      startDate,
      endDate,
      details,
      day,
      night,
      offer,
      offerEndDate,
      vendorId,
      vendorName,

      category,
      place,
      plan,
    } = req.body;
    console.log(category);
    const [categoryId, categoryName] = category.split(",");

    const plans = plan.map(
      ({ totalDay, title, description, subtitle, totalTime }) => ({
        totalDay,
        title,
        description,
        subtitle,
        totalTime,
      })
    );

    const { path, filename } = req.file;

    const packnew = await Package.create({
      vendorId,
      vendorName,
      name,
      price,
      district: disname,
      startDate,
      endDate,
      details,
      place: JSON.parse(place),
      day,
      night,
      offer,
      offerEndDate,
      image: {
        public_id: filename,
        url: path,
      },
      categoryId,
      categoryName,
      tourPlan: plans,
    });

    if (packnew) {
      res
        .status(200)
        .json({ message: "Tour Palace has been successfully added" });
    } else {
      res.status(400);
      throw new Error("Sorry! Something went wrong");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};









// export const TousistPackage = async (req, res) => {
   

//   try {
//     const currentDate = new Date();

//     const matchingPackages = await Package.find({
//       isBlocked: false,
     
//       endDate: { $gte: currentDate },
//     })
//       .sort({ createdAt: -1 })
//       .populate("vendorId");
//       const filteredPackages = matchingPackages.filter(packages => {
//         return packages.vendorId.isBlocked === false; 
//       });

//     console.log("matching data:", matchingPackages);



//     res.status(200).json(matchingPackages);
//   } catch (error) {
//     res.status(500).send({ message: "Internal Server Error" });
//   }
// };


// export const TousistPackage = async (req, res) => {
//   try {
//     const currentDate = new Date();

//     const matchingPackages = await Package.aggregate([
//       {
//         $match: {
//           isBlocked: false,
//           endDate: { $gte: currentDate },
//         },
//       },
//       {
//         $lookup: {
//           from: "vendors", // Name of the Vendor collection
//           localField: "vendorId",
//           foreignField: "_id",
//           as: "vendor",
//         },
//       },
//       {
//         $match: {
//           "vendor.isBlocked": false,
//         },
//       },
//       {
//         $sort: { createdAt: -1 },
//       },
//     ]);

//     console.log("matching package data:", matchingPackages);

//     res.status(200).json(matchingPackages);
//   } catch (error) {
//     res.status(500).send({ message: "Internal Server Error" });
//   }
// };

export const TousistPackage = async (req, res) => {
  try {
    const currentDate = new Date();

    const matchingPackages = await Package.aggregate([
      {
        $match: {
          isBlocked: false,
          endDate: { $gte: currentDate },
        },
      },
      {
        $lookup: {
          from: "vendors", 
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $match: {
          "vendor.isBlocked": false,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: "reviews", // Name of the Review collection
          localField: "_id",
          foreignField: "packageId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
          totalReviews: { $size: "$reviews" }, 

        }
      },
    ]);

    console.log("matching package data:", matchingPackages);

    res.status(200).json(matchingPackages);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};





export const getTousistPackage = asyncHandler(async (req, res) => {
    const vendorId = req.params.id;

  try {
    const matchingPackages = await Package.find({ vendorId: vendorId, isBlocked: false }).sort({

      createdAt: -1,
    });
    res.status(200).json(matchingPackages);
  } catch (error) {
    res.status(408).send({ message: "Internal Server Error" });
  }
});






export const deletePackage = asyncHandler(async (req, res) => {
  if (!req.query.id) {
    res.status(400);
    throw new Error("Package not found");
  }


  const deletePackage = await Package.deleteOne({ _id: req.query.id });

  if (deletePackage) {
    res.status(200).json({ message: "Deleted successfully" });
  } else {
    res.status(400);
    throw new Error("Something went wrong!");
  }
});









export const editPackage = async (req, res) => {
  try {
    console.log("package update start");

    console.log(req.body);

    const { packageData, id } = req.body;
    const { path, filename } = req.file;



    const {
      name,
      price,
      district,
      startDate,
      endDate,
      details,
      day,
      night,
      offer,
      offerEndDate,
      publicId,
    } = JSON.parse(packageData);

    if (!name || !price ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

   
    const updatedPackage = await Package.findByIdAndUpdate(id, {
      name,
      price,
      district,
      startDate,
      endDate,
      details,
      day,
      night,
      offer,
      offerEndDate,
      publicId,
      image: {
        public_id: filename,
        url: path,
      },
    });

    if (!updatedPackage) {
      return res.status(404).json({ message: 'Tourist place not found' });
    }
    console.log('Tourist place updated successfully');
    return res.status(200).json({ message: 'Tourist place updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};







export const blockAndUnblockPackage = asyncHandler(async (req, res) => {
  if (!req.body.id) {
    res.status(400);
    throw new Error("Package Not Found");
  }
  const pack = await Package.findById(req.body.id);
  if (pack.isBlocked) {
    const unBlock = await Package.findByIdAndUpdate(req.body.id, {
      isBlocked: false,
    });
    if (unBlock) {
      res.status(200).json({ message: `${pack.name}  Unblocked` });
    } else {
      res.status(400);
      throw new Error("Something Went Wrong");
    }
  } else {
    const block = await Package.findByIdAndUpdate(req.body.id, {
      isBlocked: true,
    });
    if (block) {
      res.status(200).json({ message: `${Package.name} Blocked` });
    } else {
      res.status(400);
      throw new Error("Something Went Wrong");
    }
  }
});


export const getPlace = asyncHandler(async (req, res) => {
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



//category

export const getCategory = asyncHandler(async (req, res) => {
  try {
    // const allCategory = await Category.find().sort({ createdAt: -1 });
    const allCategory = await Category.find({ status: true }).sort({
      createdAt: -1,
    });

    res.status(200).json(allCategory);
  } catch (error) {
    res.status(408).send({ message: "Internal Server Error" });
  }
});




export const category = async (req, res) => {
  try {
    const { cname } = req.body;

    const existingCategory = await Category.findOne({ name: cname });
    if (existingCategory) {
      return res.status(400).json({ error: "Category name already exists" });
    }

    const newCategory = new Category({ name: cname });
    await newCategory.save();
    res.status(201).json(newCategory);

    // res.status(201).json({ message: "Category has been successfully added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};




export const deleteCategory = asyncHandler(async (req, res) => {
  console.log("delete");
  console.log(req.query.id);
  if (!req.query.id) {
    res.status(400);
    throw new Error("Category not found");
  }

  const deleteCategory = await Category.deleteOne({ _id: req.query.id });

  if (deleteCategory) {
    res.status(200).json({ message: "Deleted successfully" });
  } else {
    res.status(400);
    throw new Error("Something went wrong!");
  }
});

export const editCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Please fill the fields");
  }
  if (!req.query.id) {
    res.status(400);
    throw new Error("Category not found");
  }
  const CategoryUpdated = await Category.findByIdAndUpdate(req.query.id, {
    name,
  });

  if (CategoryUpdated) {
    res.status(200).json({ message: "Updated Successfully" });
  } else {
    res.status(400);
    throw new Error("Something went wrong!");
  }
});

export const blockAndUnblockCategory = asyncHandler(async (req, res) => {
  console.log(req.body.id);
  if (!req.body.id) {
    res.status(400);
    throw new Error("Category Not Found");
  }
  const cat = await Category.findById(req.body.id);
  if (cat.status) {
    const unBlock = await Category.findByIdAndUpdate(req.body.id, {
      status: false,
    });
    if (unBlock) {
      res.status(200).json({ message: `${cat.name}  Unblocked` });
    } else {
      res.status(400);
      throw new Error("Something Went Wrong");
    }
  } else {
    const block = await Category.findByIdAndUpdate(req.body.id, {
      status: true,
    });
    if (block) {
      res.status(200).json({ message: `${Category.name} Blocked` });
    } else {
      res.status(400);
      throw new Error("Something Went Wrong");
    }
  }
});







export const fetchPackage = async (req, res) => {
  try {
    const packageId = req.params.id;


    const packages = await Package.findById(packageId);
    console.log("packages",packages);

    if (!packages) {
      return res.status(404).json({ message: 'package not found' });
    }

    return res.status(200).json({ packages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};









export const bookDetails = async (req, res) => {
  const vendorId = req.params.id;
  console.log("vendor")
  console.log("vendor Id",vendorId);

  const { startDate, endDate } = req.query;
  console.log(req.query);


  const match = { vendorId: new mongoose.Types.ObjectId(vendorId) };
  if (startDate && endDate) {
    match.dateOfPayment = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  
  try {
    const userOrders = await OrderModel.aggregate([
      {
        $match: match,
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "packageData",
        },
      },
      {
        $unwind: "$packageData",
      },
    ]);

    console.log(userOrders);

    if (userOrders.length > 0) {
      res.status(200).json(userOrders);
    } else {
      res.status(404).json({ message: "No orders found for the vendor" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const bookDetails = async (req, res) => {
//   console.log("book detailsmmmmmmmmmmmm");

//   const vendorId = req.params.id;
//   console.log("vendor id",vendorId);

//   try {
    
//     const userOrders = await OrderModel
//       .find({ vendorId: vendorId })
//       .sort({ createdAt: -1 }).populate("userId", "-password").populate("packageId", "-password")
//     console.log(userOrders);
//     if (userOrders.length === 0) {
//       return res.status(404).json({ message: "No orders found for the user" });
//     }
// console.log("orders",userOrders);
//     res.status(200).json(userOrders);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };





export const dashboardData = async (req, res) => {
  try {
    const vendorId = req.params.id;

    // Get total order amount
    const orderTotal = await OrderModel.aggregate([
      { $match: { vendorId: new mongoose.Types.ObjectId(vendorId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get total package count
    const packageTotal = await Package.countDocuments({ vendorId });

    // Get total order count
    const totalOrders = await OrderModel.countDocuments({ vendorId });

    const data = {
      totalPackage: packageTotal,
      totalCurrency: orderTotal.length > 0 ? orderTotal[0].total : 0,
      totalOrders,
    };

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving dashboard data" });
  }
};











export const dashBoardGraph = async (req, res) => {

  const vendorId = req.params.id;


  //month wise data
  const FIRST_MONTH = 1
  const LAST_MONTH = 12
  const TODAY = new Date()
  const YEAR_BEFORE = new Date(TODAY)
  YEAR_BEFORE.setFullYear(YEAR_BEFORE.getFullYear() - 1)
  console.log(TODAY, YEAR_BEFORE)
  const MONTHS_ARRAY = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const pipeLine = [
    
  {
    $match: {
        createdAt: { $gte: YEAR_BEFORE, $lte: TODAY }

    },
  },

  {
    $group: {
      _id: { year_month: { $substrCP: ["$createdAt", 0, 7] } },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { "_id.year_month": 1 }
  },
  {
    $project: {
      _id: 0,
      count: 1,
      month_year: {
        $concat: [
          { $arrayElemAt: [MONTHS_ARRAY, { $subtract: [{ $toInt: { $substrCP: ["$_id.year_month", 5, 2] } }, 1] }] },
          "-",
          { $substrCP: ["$_id.year_month", 0, 4] }
        ]
      }
    }
  },
  {
    $group: {
      _id: null,
      data: { $push: { k: "$month_year", v: "$count" } }
    }
  },
  {
    $addFields: {
      start_year: { $substrCP: [YEAR_BEFORE, 0, 4] },
      end_year: { $substrCP: [TODAY, 0, 4] },
      months1: { $range: [{ $toInt: { $substrCP: [YEAR_BEFORE, 5, 2] } }, { $add: [LAST_MONTH, 1] }] },
      months2: { $range: [FIRST_MONTH, { $add: [{ $toInt: { $substrCP: [TODAY, 5, 2] } }, 1] }] }
    }
  },
  {
    $addFields: {
      template_data: {
        $concatArrays: [
          {
            $map: {
              input: "$months1",
              as: "m1",
              in: {
                count: 0,
                month_year: {
                  $concat: [
                    { $arrayElemAt: [MONTHS_ARRAY, { $subtract: ["$$m1", 1] }] },
                    "-",
                    "$start_year"
                  ]
                }
              }
            }
          },
          {
            $map: {
              input: "$months2",
              as: "m2",
              in: {
                count: 0,
                month_year: {
                  $concat: [
                    { $arrayElemAt: [MONTHS_ARRAY, { $subtract: ["$$m2", 1] }] },
                    "-",
                    "$end_year"
                  ]
                }
              }
            }
          }
        ]
      }
    }
  },
  {
    $addFields: {
      data: {
        $map: {
          input: "$template_data",
          as: "t",
          in: {
            k: "$$t.month_year",
            v: {
              $reduce: {
                input: "$data",
                initialValue: 0,
                in: {
                  $cond: [
                    { $eq: ["$$t.month_year", "$$this.k"] },
                    { $add: ["$$this.v", "$$value"] },
                    { $add: [0, "$$value"] }
                  ]
                }
              }
            }
          }
        }
      }
    }
  },
  {
    $project: {
      data: { $arrayToObject: "$data" },
      _id: 0
    }
  }]
  const vendorPipeLine = [
    
 

  {
    $match: {
      vendorId: new mongoose.Types.ObjectId(vendorId),

        createdAt: { $gte: YEAR_BEFORE, $lte: TODAY }

    },
  },

  {
    $group: {
      _id: { year_month: { $substrCP: ["$createdAt", 0, 7] } },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { "_id.year_month": 1 }
  },
  {
    $project: {
      _id: 0,
      count: 1,
      month_year: {
        $concat: [
          { $arrayElemAt: [MONTHS_ARRAY, { $subtract: [{ $toInt: { $substrCP: ["$_id.year_month", 5, 2] } }, 1] }] },
          "-",
          { $substrCP: ["$_id.year_month", 0, 4] }
        ]
      }
    }
  },
  {
    $group: {
      _id: null,
      data: { $push: { k: "$month_year", v: "$count" } }
    }
  },
  {
    $addFields: {
      start_year: { $substrCP: [YEAR_BEFORE, 0, 4] },
      end_year: { $substrCP: [TODAY, 0, 4] },
      months1: { $range: [{ $toInt: { $substrCP: [YEAR_BEFORE, 5, 2] } }, { $add: [LAST_MONTH, 1] }] },
      months2: { $range: [FIRST_MONTH, { $add: [{ $toInt: { $substrCP: [TODAY, 5, 2] } }, 1] }] }
    }
  },
  {
    $addFields: {
      template_data: {
        $concatArrays: [
          {
            $map: {
              input: "$months1",
              as: "m1",
              in: {
                count: 0,
                month_year: {
                  $concat: [
                    { $arrayElemAt: [MONTHS_ARRAY, { $subtract: ["$$m1", 1] }] },
                    "-",
                    "$start_year"
                  ]
                }
              }
            }
          },
          {
            $map: {
              input: "$months2",
              as: "m2",
              in: {
                count: 0,
                month_year: {
                  $concat: [
                    { $arrayElemAt: [MONTHS_ARRAY, { $subtract: ["$$m2", 1] }] },
                    "-",
                    "$end_year"
                  ]
                }
              }
            }
          }
        ]
      }
    }
  },
  {
    $addFields: {
      data: {
        $map: {
          input: "$template_data",
          as: "t",
          in: {
            k: "$$t.month_year",
            v: {
              $reduce: {
                input: "$data",
                initialValue: 0,
                in: {
                  $cond: [
                    { $eq: ["$$t.month_year", "$$this.k"] },
                    { $add: ["$$this.v", "$$value"] },
                    { $add: [0, "$$value"] }
                  ]
                }
              }
            }
          }
        }
      }
    }
  },
  {
    $project: {
      data: { $arrayToObject: "$data" },
      _id: 0
    }
  }]
  const userChart = await User.aggregate(pipeLine)
  const packageChart = await Package.aggregate(vendorPipeLine)
  const orderChart = await OrderModel.aggregate(pipeLine)

  res.json({

    userChart,
    packageChart,
    orderChart
  })

}





export const getVendorInfo = asyncHandler(async (req, res) => {

  console.log("infoooooo")
  const vendorId = req.params.vendorId;
  console.log(vendorId);

try {
  const vendorInfo = await Vendor.findById(vendorId).select('-password');

  console.log(vendorInfo);

  res.status(200).json(vendorInfo);
} catch (error) {
  res.status(408).send({ message: "Internal Server Error" });
}
});


export const vendorProfileImage = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;
 
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  const updatedUser = await Vendor.findByIdAndUpdate(
    vendorId,
    { image: req.file.path },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: 'Vendor not found' });
  }

  return res.status(200).json({ message: 'Profile image updated successfully', vendor: updatedVendor });
});
