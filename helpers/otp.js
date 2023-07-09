
// import twilio from 'twilio';

// import dotenv from 'dotenv';
// dotenv.config();

// const { serviceSID, accountSID, authToken } = process.env;
// const client = twilio(accountSID,authToken, { lazyloading: true });




// const sendOTP= async (req, res, next) => {
//     try {
//       const { countryCode, phoneNumber } = req.body;
  
//       if (!countryCode || !phoneNumber) {
//         throw new Error("Invalid phone number provided");
//       }
  
//       const otpResponse = await client.verify.v2.services(serviceSID).verifications.create({
//         to: `+${countryCode}${phoneNumber}`,
//         channel: "sms",
//       });
  
//       res.status(200).send(`OTP sent successfully!: ${JSON.stringify(otpResponse)}`);
//     } catch (error) {
//       console.error("Error sending OTP:", error);
//       res.status(400).send(error.message || "Something went wrong!");
//     }
//   };
  




//   const verifyOTP = async (req, res, next) => {
//     try {
//       const { countryCode, phoneNumber, otp } = req.body;
  
//       if (!countryCode || !phoneNumber || !otp) {
//         throw new Error("Invalid data provided for OTP verification");
//       }
  
//       const verificationResponse = await client.verify.v2.services(serviceSID).verificationChecks.create({
//         to: `+${countryCode}${phoneNumber}`,
//         code: otp,
//       });
  
//       res.status(200).send(`OTP verified successfully!: ${JSON.stringify(verificationResponse)}`);
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       res.status(400).send(error.message || "Something went wrong!");
//     }
//   };
  
  
  
  
  
//   export { sendOTP, verifyOTP };

