import User from "../model/userModel.js";
import validator from "validator"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js";
import sendMail from "../config/sendMail.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    let existUser = await User.findOne({email})

    if(existUser){
        return res.status(400).json({message:" User is already exist"})
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({
            message:"Enter Valid Email"
        })
    }
    if(password.length < 8){
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
    let token = await genToken(user._id)
    res.cookie("token",token ,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge: 7 * 24 * 60 * 1000
    })
    return res.status(201).json(user)
  } catch (error) {
    return res.status(500).json({message:`SignUp error ${error}`})
  }
}

export const login = async (req,res) =>{
  try {
    const {email , password} = req.body
    let user = await User.findOne({email})
    if(!user){
        return res.status(404).json({message:" User  not found"})
    }

    let isMatch = await bcrypt.compare(password , user.password)
    if(!isMatch){
        return res.status(400).json({message:" Incorrect Password"})
    }

    let token = await genToken(user._id)
    res.cookie("token",token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge: 7 * 24 * 60 * 1000
    })
    return res.status(200).json(user)
  } catch (error) {
      return res.status(500).json({message:`Login error ${error}`})
  }
}

export const logOut = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
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
