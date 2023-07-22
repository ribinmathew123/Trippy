import User from "../../models/user/userModel.js";
import OrderModel from "../../models/payment/paymentModel.js";


import Place from "../../models/admin/placeModel.js";

import Vendor from "../../models/vendor/VendorModel.js";

import Package from "../../models/vendor/packageModel.js";

import asyncHandler from "express-async-handler";

import jwt from "jsonwebtoken";

import cloudinary from "../../config/cloudinary.js";
import dotenv from "dotenv";
dotenv.config();
const adminLogin = asyncHandler(async (req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    const adminPassword = process.env.ADMIN_PASSWORD;
    const { userName, password } = req.body;

    if (!userName || !password) {
      res.status(400).json({ message: "Please enter username and password" });
      return;
    }

    if (userName === adminEmail && password === adminPassword) {
      const token = generateAuthToken(userName);

      res.status(200).json({
        name: userName,
        token: token,
      });
    } else if (userName !== adminEmail) {
      res.status(400).json({ message: "Incorrect email" });
    } else {
      res.status(400).json({ message: "Incorrect password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

const generateAuthToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "10d" });
};

export const getAllUser = async (req, res) => {
  try {
    const getAllUser = await User.find().sort({ createdAt: -1 });

    res.json({
      status: true,
      AllUsers: getAllUser,
    });
  } catch (error) {
    console.log(error.message);
  }
};



export const getAllVendor = async (req, res) => {
  try {
    const getAllVendor = await Vendor.find().sort({ createdAt: -1 });
    console.log(getAllVendor);

    res.json({
      status: true,
      AllVendors: getAllVendor,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const blockAndUnblockVendor = asyncHandler(async (req, res) => {
  if (!req.body.id) {
    res.status(400);
    throw new Error("User Not Found");
  }
  const vendor = await Vendor.findById(req.body.id);

  if (!vendor) {
    res.status(404);
    throw new Error("User Not Found");
  }

  const isBlocked = vendor.isBlocked;

  const updatedVendor = await Vendor.findByIdAndUpdate(req.body.id, {
    isBlocked: !isBlocked,
  });

  if (updatedVendor) {
    const message = updatedVendor.isBlocked
      ? `${vendor.name} Blocked`
      : `${vendor.name} Unblocked`;
    res.status(200).json({ message });
  } else {
    res.status(400);
    throw new Error("Something Went Wrong");
  }
});




const blockAndUnblockUser = asyncHandler(async (req, res) => {
  if (!req.body.id) {
    res.status(400);
    throw new Error("User Not Found");
  }
  const user = await User.findById(req.body.id);

  if (!user) {
    res.status(404);
    throw new Error("User Not Found");
  }

  const isBlocked = user.isBlocked;

  const updatedUser = await User.findByIdAndUpdate(req.body.id, {
    isBlocked: !isBlocked,
  });

  if (updatedUser) {
    const message = updatedUser.isBlocked
      ? `${user.name} Blocked`
      : `${user.name} Unblocked`;
    res.status(200).json({ message });
  } else {
    res.status(400);
    throw new Error("Something Went Wrong");
  }
});







const getPlace = async (req, res) => {
  try {
    const Allplace = await Place.find({ isBlocked: false }).sort({ createdAt: -1 });
    if (Allplace) {
      res.status(200).json(Allplace);
    } else {
      res.status(400);
      throw new Error("Something went wrong!");
    }
  } catch (error) {
    console.log(error);
  }
};










const addPlace = async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      place,
      type,
      disname,
      details,
      city,
    } = req.body;
    const { path, filename } = req.file;

  

    const Toustplace = await Place.create({
      
      image: {
        public_id: filename,
        url: path,
      },
      place:place,
      type:type,

      district:disname,
      description: details,
      city:city,
    });

    if (Toustplace) {
      res.status(200);
      res.json({ message: 'Tour Palace has been successfully added' });
    } else {
      res.status(400);
      throw new Error('Sorry! Something went wrong');
    }
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
    };



    








export const deletePlace = asyncHandler(async (req, res) => {
  console.log(req.query.id);

  if (!req.query.id) {
    res.status(400);

    throw new Error("Place not found");
  }

  const deletePlace = await Place.deleteOne({ _id: req.query.id });

  if (deletePlace) {
    res.status(200).json({ message: "Deleted successfully" });
  } else {
    res.status(400);
    throw new Error("Something went wrong!");
  }
});


export const fetchPlace = async (req, res) => {
  try {
    const placeId = req.params.id;

    // Validate the placeId if necessary

    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    return res.status(200).json({ place });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};






export const editPlace = async (req, res) => {
  
  try {
    const { placeData, id } = req.body;
    const { place, type, district, description } = JSON.parse(placeData);


    let image = {};
    if (req.file) {
      const { path, filename } = req.file;
      image = {
        public_id: filename,
        url: path,
      };
    }

    const existingPlace = await Place.findById(id);

    if (!existingPlace) {
      return res.status(404).json({ message: 'Tourist place not found' });
    }

    const updatedPlace = {
      place: place || existingPlace.place,
      type: type || existingPlace.type,
      district: district || existingPlace.district,
      description: description || existingPlace.description,
      city: district || existingPlace.city,
      image: req.file ? image : existingPlace.image,
    };

    
    await Place.findByIdAndUpdate(id, updatedPlace);

    console.log('Tourist place updated successfully');
    return res.status(200).json({ message: 'Tourist place updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};






export const blockAndUnblockPlace = asyncHandler(async (req, res) => {
  if (!req.body.id) {
    res.status(400);
    throw new Error("Package Not Found");
  }
  const touristPlace = await Place.findById(req.body.id);
  if (touristPlace.isBlocked) {
    const unBlock = await Place.findByIdAndUpdate(req.body.id, {
      isBlocked: false,
    });
    if (unBlock) {
      res.status(200).json({ message: `${touristPlace.name}  Unblocked` });
    } else {
      res.status(400);
      throw new Error("Something Went Wrong");
    }
  } else {
    const block = await Place.findByIdAndUpdate(req.body.id, {
      isBlocked: true,
    });
    if (block) {
      res.status(200).json({ message: `${touristPlace.name} Blocked` });
    } else {
      res.status(400);
      throw new Error("Something Went Wrong");
    }
  }
});


const getPackage = asyncHandler(async (req, res) => {
  try {
    const Allpackage = await Package.find().sort({ createdAt: -1 });
    if (Allpackage) {
      res.status(200).json(Allpackage);
    } else {
      res.status(400);
      throw new Error("Something went wrong!");
    }
  } catch (error) {
    console.log(error);
  }
});






export const displayCharts = async (req, res) => {

  //month wise data
  const FIRST_MONTH = 1
  const LAST_MONTH = 12
  const TODAY = new Date()
  const YEAR_BEFORE = new Date(TODAY)
  YEAR_BEFORE.setFullYear(YEAR_BEFORE.getFullYear() - 1)
  console.log(TODAY, YEAR_BEFORE)
  const MONTHS_ARRAY = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const pipeLine = [{
    $match: {
      createdAt: { $gte: YEAR_BEFORE, $lte: TODAY }
    }
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
  const vendorChart = await Vendor.aggregate(pipeLine)

  const packageChart = await Package.aggregate(pipeLine)
  const orderChart = await OrderModel.aggregate(pipeLine)


  res.json({

    userChart,
    vendorChart,
    packageChart,
    orderChart
  })

}



export const displayDashboardData = async (req, res) => {
  try {
  
    const packageTotal = await Package.countDocuments();

    
    const totalOrders = await OrderModel.countDocuments();

  
    const totalUsers = await User.countDocuments();


    const totalVendors = await Vendor.countDocuments();

   

    const data = {
      totalPackage: packageTotal,
      totalOrders,
      totalUsers,
      totalVendors
    };

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving dashboard data" });
  }
};







export {
  adminLogin,
  blockAndUnblockUser,
  blockAndUnblockVendor,
  addPlace,
  getPlace,
  getPackage,
};
