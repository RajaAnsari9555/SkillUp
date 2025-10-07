import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // lowercase works too
  auth: {
    user: process.env.USER_EMAIL,     // ✅ will read from .env
    pass: process.env.USER_PASSWORD,  // ✅ app password, not Gmail password
  },
});

const sendMail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to,
    subject: "Reset Your Password",
    html: `<p>Your OTP for Password Reset is <b>${otp}</b>. It expires in 10 minutes.</p>`,
  });
};

export default sendMail;
