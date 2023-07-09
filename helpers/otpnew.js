require('dotenv').config();
const twilio = require('twilio');

const serviceSID = process.env.TWILIO_SERVICE_SID;
const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSID, authToken);

const sendOtp = (phoneNumber) => {
  return new Promise((resolve, reject) => {
    client.verify.v2
      .services(serviceSID)
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
  return new Promise((resolve, reject) => {
    client.verify.v2
      .services(serviceSID)
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

module.exports = {
  sendOtp,
  verifyOtp,
};
