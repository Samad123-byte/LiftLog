import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import setCookie, { clearAuthCookie } from "../utils/setCookie.js";

export const registerUser = async (req, res) => {

try {

const {name, email, password} = req.body;

if(!name || !email || !password) {

return res.status(400).json({
message: "Please fill all the Fields"
})

}

const existingUser = await User.findOne({email});

if(existingUser) {

return res.status(400).json({
message: "User already exists"
})

}

const salt = await bcrypt.genSalt(10);

const hashedPassword = await bcrypt.hash(password, salt)

const user = await User.create({
name,
email,
password: hashedPassword
})

const token = generateToken(user._id);

setCookie(res, token);

res.status(201).json({
 success:true,
 message:"Registration successful",
 user:{
    id:user._id,
    name:user.name,
    email:user.email
 }
})
    
} catch (error) {

   console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
    
}

}


export const loginUser = async (req,res) => {

try {

const {email , password} = req.body;

if(!email || !password) {

return res.status(400).json({
message: "kindly fill all the fields"
})

}

const user = await User.findOne({email}).select("+password")

if(!user) {

return res.status(400).json({

message: "Invalid Email and Password"

})

}

const isPasswordMatch = await bcrypt.compare(password, user.password);

if(!isPasswordMatch) {

return res.status(400).json({
message: "Invalid password and Email"
})

}

const token = generateToken(user._id);

setCookie(res, token);

 res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
    
} catch (error) {
 
  res.status(500).json({
      success: false,
      message: "Server Error",
    });
    
}

}


export const logoutUser = async (req, res) => {
  try {

    clearAuthCookie(res);

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {

    console.error("Logout Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

export const getCurrentUser = async (req, res) => {

  try {

    res.status(200).json({
      success: true,
      user: req.user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};