import User from "../model/userModel.js";
import validator from "validator" 
import bcrypt from "bcryptjs"
import genToken from "../config/token.js";
import sendMail from "../config/sendMail.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try {
    console.log("📝 Signup request received:", req.body.email);
    const { name, email, password, role } = req.body
    let existUser = await User.findOne({email})

    if(existUser){
        console.log("❌ User already exists:", email);
        return res.status(400).json({message:" User is already exist"})
    }
    if(!validator.isEmail(email)){
        console.log("❌ Invalid email:", email);
        return res.status(400).json({
            message:"Enter Valid Email"
        })
    }
    if(password.length < 8){
        console.log("❌ Password too short");
        return res.status(400).json({
            message:"Enter Strong Password"
        })
    }

    let hashPassword = await bcrypt.hash(password,10)

    const user = await User.create({
        name,
        email,
        password:hashPassword,
        role
    })
    console.log("✅ User created:", user._id);
    
    let token = await genToken(user._id)
    console.log("✅ Token generated:", token.substring(0, 20) + "...");
    
    // Cookie settings - secure: false for localhost
    const isProduction = process.env.NODE_ENV === 'production'
    console.log("🔧 Environment:", isProduction ? "production" : "development");
    console.log("🍪 Setting cookie with secure:", isProduction, "sameSite:", isProduction ? "none" : "lax");
    
    res.cookie("token", token, {
        httpOnly: true,  
        secure: isProduction, // false for localhost, true for production
        sameSite: isProduction ? "none" : "lax", // lax for localhost, none for production
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    
    console.log("✅ Cookie set, sending response");
    return res.status(201).json(user)
  } catch (error) {
    console.log("❌ Signup error:", error);
    return res.status(500).json({message:`SignUp error ${error}`})
  }
}

export const login = async (req,res) =>{
  try {
    console.log("🔐 Login request received:", req.body.email);
    const {email , password} = req.body
    let user = await User.findOne({email})
    if(!user){
        console.log("❌ User not found:", email);
        return res.status(404).json({message:" User  not found"})
    }

    let isMatch = await bcrypt.compare(password , user.password)
    if(!isMatch){
        console.log("❌ Incorrect password for:", email);
        return res.status(400).json({message:" Incorrect Password"})
    }
    
    console.log("✅ Password matched for:", email);
    let token = await genToken(user._id)
    console.log("✅ Token generated:", token.substring(0, 20) + "...");
    
    // Cookie settings - secure: false for localhost
    const isProduction = process.env.NODE_ENV === 'production'
    console.log("🔧 Environment:", isProduction ? "production" : "development");
    console.log("🍪 Setting cookie with secure:", isProduction, "sameSite:", isProduction ? "none" : "lax");
    
    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction, // false for localhost, true for production
        sameSite: isProduction ? "none" : "lax", // lax for localhost, none for production
        maxAge: 7 * 24 * 60 * 1000
    })
    
    console.log("✅ Cookie set, sending response");
    return res.status(200).json(user)
  } catch (error) {
      console.log("❌ Login error:", error);
      return res.status(500).json({message:`Login error ${error}`})
  }
}

export const logOut = (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production'
    res.clearCookie("token", { 
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    console.log("✅ User logged out, token cookie cleared")
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: `LogOut error ${error}` });
  }
}

export const sendOTP = async (req,res) =>{
  try {
    const {email} = req.body
    const user = await User.findOne({email})
    if(!user){
       return res.status(404).json({message:" User  not found"})
    }
    const otp = Math.floor(1000 + Math.random()*9000).toString()

    user.resetOtp = otp, 
    user.otpExpires = Date.now() + 10 * 60 * 1000,
    user.isOtpVerified = false 
 
    await user.save()
    await sendMail(email , otp)  
    return res.status(200).json({message:"OTP send successfully"})
    
  } catch (error) {
     return res.status(500).json({message:`send Otp error ${error}`})
  }
}

export const verifyOTP =  async (req ,res) =>{
  try {
    const {email ,otp} = req.body
    const user = await User.findOne({email})
    if(!user ||  user.resetOtp != otp ||  user.otpExpires < Date.now() ){
       return res.status(404).json({message:"Invalid OTP"})
    }
    user.isOtpVerified = true,
    user.resetOtp = undefined,
    user.otpExpires = undefined
    await user.save()

    return res.status(200).json({message:`OTP verified successfully`}) // ✅ fixed (was 500)
    
  } catch (error) {
     return res.status(500).json({message:`Verify Otp error ${error}`})
  }
}

export const resetPassword = async (req ,res) => {
  try {
    const {email , password} = req.body
    const user = await User.findOne({email})
    if(!user ||  !user.isOtpVerified ){
       return res.status(400).json({message:"OTP verification is required"}) // ✅ fixed (was 200)
    }
    const hashPassword = await bcrypt.hash(password,10)
    user.password = hashPassword,
    user.isOtpVerified= false
    await user.save()
    return res.status(200).json({message:`Reset Password Successfully`}) // ✅ fixed (was 500)
  } catch (error) {
    return res.status(500).json({message:`reset password error ${error}`})
  }  
}
