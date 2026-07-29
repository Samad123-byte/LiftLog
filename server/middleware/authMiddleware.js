import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
  if(req.cookies.token){
    token = req.cookies.token;
}

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user from token id
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // Continue to next middleware/controller
    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Not authorized. Invalid token.",
    });
  }
};

export default protect;