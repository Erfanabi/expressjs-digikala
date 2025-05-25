const { Router } = require("express");
const { sendOtpHandler, checkOtpHandler } = require("./auth.service");

const router = Router();

router.post("/send-otp", sendOtpHandler);
router.post("/check-otp", checkOtpHandler);

module.exports = {
  authRoutes: router,
};
