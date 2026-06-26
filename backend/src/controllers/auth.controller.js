const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
const tokenBlackListModel = require("../models/blackList.model");

/**
 * Create JWT token
 */
function createToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );
}

/**
 * - User Register Controller
 * - POST /api/auth/register
 */
async function userRegisterController(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
        status: "failed",
      });
    }

    if (password.length <= 6) {
      return res.status(400).json({
        message: "Password must be more than 6 characters",
        status: "failed",
      });
    }

    const isExists = await userModel.findOne({ email });

    if (isExists) {
      return res.status(422).json({
        message: "User already exists with email.",
        status: "failed",
      });
    }

    const user = await userModel.create({
      email,
      password,
      name,
    });

    const token = createToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(201).json({
      message: "User registered successfully",
      status: "success",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });

    try {
      await emailService.sendRegistrationEmail(user.email, user.name);
    } catch (emailError) {
      console.log("Registration email failed:", emailError.message);
    }
  } catch (error) {
    console.log("Register error:", error);

    res.status(500).json({
      message: error.message || "Something went wrong during registration",
      status: "failed",
    });
  }
}

/**
 * - User Login Controller
 * - POST /api/auth/login
 */
async function userLoginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        status: "failed",
      });
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Email or password is INVALID",
        status: "failed",
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Email or password is INVALID",
        status: "failed",
      });
    }

    const token = createToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "User logged in successfully",
      status: "success",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.log("Login error:", error);

    res.status(500).json({
      message: error.message || "Something went wrong during login",
      status: "failed",
    });
  }
}

/**
 * - User Logout Controller
 * - POST /api/auth/logout
 */
async function userLogoutController(req, res) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (token) {
      await tokenBlackListModel.create({ token });
    }

    res.clearCookie("token");

    res.status(200).json({
      message: "User logged out successfully",
      status: "success",
    });
  } catch (error) {
    console.log("Logout error:", error);

    res.status(500).json({
      message: error.message || "Something went wrong during logout",
      status: "failed",
    });
  }
}

/**
 * - Get Current User Controller
 * - GET /api/auth/me
 */
async function getMeController(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized user",
        status: "failed",
      });
    }

    res.status(200).json({
      status: "success",
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    console.log("Get me error:", error);

    res.status(500).json({
      message: error.message || "Something went wrong while fetching user",
      status: "failed",
    });
  }
}

module.exports = {
  userRegisterController,
  userLoginController,
  userLogoutController,
  getMeController,
};