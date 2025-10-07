import express from "express";
import { RazorpayOrder, verifyPayment } from "../controller/orderController.js";

const paymentRouter = express.Router()

paymentRouter.post("/razorpay-order", RazorpayOrder)
paymentRouter.post("/verify-payment", verifyPayment)

export default paymentRouter

