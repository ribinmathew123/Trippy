// import jwt from 'jsonwebtoken';
// // Middleware to protect admin routes
// export const adminProtect = async (req, res, next) => {

//   try {
//     const token = req.headers.authorization?.split(' ')[1]; // Get token from header

//     if (!token) {
//       return res.status(401).json({ error: 'Not Authorized, No Token' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (error) => {
//       if (error) {
//         return res.status(401).json({ error: 'Authentication failed' });
//       }

//       next();
//     });
//   } catch (error) {
//     res.status(401);
//     throw new Error('Not Authorized');
//   }
// };





// // Middleware to protect vendor routes
// export const vendorProtect = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1]; // Get token from header
//     if (!token) {
//       return res.status(401).json({ error: 'Not Authorized, No Token' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (error) => {
//       if (error) {
//         return res.status(401).json({ error: 'Authentication failed' });
//       }

//       next();
//     });
//   } catch (error) {
//     res.status(401);
//     throw new Error('Not Authorized');
//   }
// };





// export const verifyUserToken = asyncHandler(async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1]
//   if (!token) {
//       res.json({
//           status: false,
//           message: "Token not found"
//       })
//       throw Error("Token Not Found")
//       return
//   }
//   const decode = await verifyJwtToken(token)
//   const currentTime = new Date()
//   if (decode.exp && decode.exp > (currentTime.getTime() / 1000)) {
//       if (decode.email === ADMIN_EMAIL) {
//           req.admin = decode.email
//           return next()
//       }





//       const User = await user.findById({ _id: decode._id })
//       if (User) {
//           if (User.isBanned) {
//               res.json({
//                   status: false,
//                   message: "User is banned"
//               })
//               throw Error(`Banned user ${User.name }is try to access
//               `)
//           }
//           req.user = User
//           next()
//       } else {
//           res.status(404).json({
//               status: false,
//               message: "User not found"
//           })
//           throw Error("user not found")
//       }
//   } else {
//       res.json({
//           status: false,
//           message: "Token Expired"
//       })
//       throw Error("Token Expired")
//   }
// })









 import jwt from 'jsonwebtoken';

import asyncHandler from 'express-async-handler'

import User from "../models/user/userModel.js";
import Vendor from "../models/vendor/VendorModel.js";
import dotenv from "dotenv";
dotenv.config();

export const protect = asyncHandler(async (req, res, next ) => {
  let token



  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      //  Get Token from header
      token = req.headers.authorization.split(' ')[1]
      console.log("chek token",token);
      
      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

     
      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      res.status(401)
      throw new Error('Not AUthorized')
    }
  }

  if(!token) {
    res.status(401)
    throw new Error('Not Authorized, No Token')
  }
})



// const adminProtect = asyncHandler(async (req, res, next ) => {
//   let token

//   if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       //  Get Token from header
//       token = req.headers.authorization.split(' ')[1]


//       // Verify Token
//       // const decoded = jwt.verify(token, process.env.JWT_SECRET)
//       const decode = await verifyJwtToken(token)
//       //   const currentTime = new Date()
//       //   if (decode.exp && decode.exp > (currentTime.getTime() / 1000)) {
//             if (decode.email === ADMIN_EMAIL) {
//                 req.admin = decode.email
//                 return next()
//       //       }


//       // req.admin = await Admin.findById(decoded.id).select('-password')

//       // next()
//     } catch (error) {
//       res.status(401)
//       throw new Error('Not AUthorized')
//     }
//   }

//   if(!token) {
//     res.status(401)
//     throw new Error('Not Authorized, No Token')
//   }
// })



export const adminProtect = async (req, res, next) => {

  const authHeader = req.headers.authorization
  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    res.status(401)
    throw new Error('Not Authorized, No Token')
  }

  const token = authHeader.split(' ')[1]

  try {
    console.log("ddddddddddddddd");
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // const decode = await verifyJwtToken(token)
    console.log("decode",decoded);
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      res.status(401)
      throw new Error('Not Authorized')
    }

    req.admin = decoded.email
    next()
  } catch (error) {
    res.status(401)
    throw new Error('Not Authorized')
  }
}













export const vendorProtect = asyncHandler(async (req, res, next ) => {
  let token

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      //  Get Token from header
      token = req.headers.authorization.split(' ')[1]


      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)


      req.admin = await Vendor.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      res.status(401)
      throw new Error('Not AUthorized')
    }
  }

  if(!token) {
    res.status(401)
    throw new Error('Not Authorized, No Token')
  }
})












export const isAuthenticated = (req, res, next) => {
  if (req.user) {
    // User is authenticated
    next();
  } else {
    res.status(401).json({ error: 'Please login to perform this action.' });
  }
};




