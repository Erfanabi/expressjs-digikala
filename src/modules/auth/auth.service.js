const createHttpError = require("http-errors");
const { User, Otp } = require("../user/user.model");

async function sendOtpHandler(req, res, next) {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      throw createHttpError(400, "Mobile number is required");
    }

    let code = Math.floor(Math.random() * 99999 - 10000) + 10000;
    let otp = null;

    let user = await User.findOne({
      where: { mobile },
    });

    if (!user) {
      user = await User.create({
        mobile,
      });

      await Otp.create({
        code,
        expires_in: new Date(Date.now() + 1000 * 60),
        userId: user.id,
      });

      return res.json({
        message: "otp send successfully",
        code,
      });
    } else {
      otp = await Otp.findOne({ where: { userId: user?.id } });

      otp.code = code;
      otp.expires_in = new Date(Date.now() + 1000 * 60);

      await otp.save();

      return res.json({
        message: "otp send successfully",
        code,
      });
    }
  } catch (error) {
    next(error);
  }
}

async function checkOtpHandler(req, res, next) {
  try {
    const { mobile, code } = req.body;

    if (!mobile || !code) {
      throw createHttpError(400, "Mobile and code are required");
    }

    let user = await User.findOne({
      where: { mobile },
      include: [{ model: Otp, as: "otp" }],
    });

    if (!user) {
      throw createHttpError(401, "not found user account");
    }

    if (user?.otp?.code !== code) {
      throw createHttpError(401, "otp code is invalid");
    }

    if (user?.otp?.expires_in < new Date()) {
      throw createHttpError(401, "otp code is expired");
    }

    return res.json({
      message: "logged-in successfully",
      // accessToken,
      // refreshToken
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendOtpHandler,
  checkOtpHandler,
};
