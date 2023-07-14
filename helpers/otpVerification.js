import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();


const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, { lazyloading: true });




const sendOtp = (phoneNumber) => {
  console.log("otp dta");
  return new Promise((resolve, reject) => {

    client.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verifications.create({
        to: `+91${phoneNumber}`,
        channel: 'sms',

      })
      

      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject({ status: error.status, message: error.message });
      });
  });
};








const verifyOtp = (phoneNumber, otpCode) => {

  console.log("data "+phoneNumber,otpCode)
  
  return new Promise((resolve, reject) => {
    client.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${phoneNumber}`,
        code: otpCode,
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject({ status: error.status, message: error.message });
      });
  });
};


export { sendOtp,
  verifyOtp
};
