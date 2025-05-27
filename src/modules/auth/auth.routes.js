const { Router } = require("express");
const {
  sendOtpHandler,
  checkOtpHandler,
  verifyRefreshTokenHandler,
} = require("./auth.service");

const router = Router();

router.post("/send-otp", sendOtpHandler);
router.post("/check-otp", checkOtpHandler);
router.post("/refresh-token", verifyRefreshTokenHandler);

module.exports = {
  authRoutes: router,
};
