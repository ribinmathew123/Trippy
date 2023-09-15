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
import { verifyJwtToken } from './verifyTocken.js';
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
      console.log("check token",token);
      
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















export const adminProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    res.status(401).json({
      status: false,
      message: "Token not found"
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const currentTime = new Date().getTime() / 1000
    if (decoded.exp && decoded.exp > currentTime) {
      if (decoded.email === process.env.ADMIN_EMAIL) {
        req.admin = decoded.email
        return next()
      }
    }
  
    res.status(401)
  } catch (error) {
    res.status(401)
  }
}







export const isAuthenticated = asyncHandler(async (req, res, next) => {


  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

  const token = req.headers.authorization?.split(' ')[1]
  if (!token) { 
      res.json({
          status: false,
          message: "Token not found"
      }) 

  }
  const decode = await verifyJwtToken(token)
  const currentTime = new Date()
  if (decode.exp && decode.exp > (currentTime.getTime() / 1000)) {
  

      const user = await User.findById( decode.id)
      if (user) {
          if (user.isBlocked) {
            console.log("userblocked");
              return res.status(400).json({
                  status: true,
                  message: "user  is Blocked"
              })
          }
          req.User = user
          next()
      } else {
          res.status(404).json({
              status: false,
              message: "User not found"
          })
      }
  } else {
      res.json({
          status: false,
          message: "Token Expired" 
      })
  }}
}) 






export const vendorProtect = asyncHandler(async (req, res, next) => {

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
      res.json({
          status: false,
          message: "Token not found"
      })
    
  }
  const decode = await verifyJwtToken(token)
  const currentTime = new Date()
  if (decode.exp && decode.exp > (currentTime.getTime() / 1000)) {
    
      const vendor = await Vendor.findById( decode.id)
      if (vendor) {
          if (vendor.isBlocked) {
            console.log("vendorblocked");

            return res.status(403).json({
              status: true,
              message: "Vendor  is Blocked"
          })
            
          }
          req.Vendor = vendor
          next()
      } else {
         return res.status(404).json({
                  status: false,
                  message: "vendor not found"
              })
      }
  } else {
      res.json({
          status: false,
          message: "Token Expired" 
      })
  }}
}) 






















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




// const verifyToken = (token) => {
//   return new Promise((resolve, reject) => {
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(decoded);
//       }
//     });
//   });
// };



// export const vendorProtect = asyncHandler(async (req, res, next ) => {
//   let token
// console.log("hhhhhhhhhhhhhhhh",req.headers.authorization);
//   if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       //  Get Token from header
//       token = req.headers.authorization.split(' ')[1]
      
//       // Verify Token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET)

     
//       req.vendor = await Vendor.findById(decoded.id).select('-password')

//       return next()
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





// export const vendorProtect = asyncHandler(async (req, res, next) => {
//   let token;
//   console.log("hhhhhhhhhhhhhhhh", req.headers.authorization);
  
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       // Get Token from header
//       token = req.headers.authorization.split(' ')[1];

//       // Verify Token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.vendor = await Vendor.findById(decoded.id).select('-password');

//       return next();
//     } catch (error) {
//       res.status(401);
//       return next(new Error('Not Authorized'));
//     }
//   }

//   if (!token) {
//     res.status(401);
//     return next(new Error('Not Authorized, No Token'));
//   }
// });





// export const vendorProtect = async (req, res, next) => {
//   console.log("vendorProtect");
//   console.log("head",req.headers.authorization);
//   try {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//       token = req.headers.authorization.split(' ')[1];
//       console.log("token",token);

//       const decoded = jwt.verify(token, process.env.JWT_SECRET)
//       console.log("1",decoded);

//       const Vendor = await vendor.findById(decoded.id ).select('-password');
//       console.log("2",Vendor);

//       if (Vendor) {
//         if (Vendor.isBlocked) {
//           res.json({
//             status: false,
//             message: "Vendor is banned",
//           });
//           throw new Error(`Banned Vendor ${Vendor.name} is trying to access`);
//         }
//         req.vendor = Vendor;
//         next();
//       } else {
//         res.status(404).json({
//           status: false,
//           message: "Vendor not found",
//         });
//         throw new Error("Vendor not found");
//       }
//     } else {
//       res.json({
//         status: false,
//         message: "Token expired",
//       });
//       throw new Error("Token expired");
//     }
//   } catch (err) {
//     res.status(401).json({
//       status: false,
//       message: "Unauthorized",
//     });
//     throw new Error("Unauthorized");
//   }
// };













// export const isAuthenticated = (req, res, next) => {
//   if (req.user) {
//     // User is authenticated
//     next();
//   } else {
//     res.status(401).json({ error: 'Please login to perform this action.' });
//   }
// };




