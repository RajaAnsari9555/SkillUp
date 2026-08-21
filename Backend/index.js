import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/connectDB.js'
import cookieParser from 'cookie-parser'
import authRouter from './route/authRoute.js'
dotenv.config()
import cors from "cors"
import userRouter from './route/userRoute.js'
import courseRouter from './route/courseRoute.js'
import paymentRouter from './route/paymentRoute.js'
import reviewRouter from './route/reviewRoute.js'
import systemDesignRouter from './route/systemDesignRoute.js'
import noteRouter from './route/noteRoute.js'
import quizRouter from './route/quizRoute.js'

const port = process.env.PORT
const app = express()
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin:["https://skillup-1-s65l.onrender.com",
     "http://localhost:5173",
     "http://localhost:5174"],
    credentials:true
}))
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/course",courseRouter)
app.use("/api/payment",paymentRouter)
app.use("/api/review",reviewRouter)
app.use("/api/systemdesign",systemDesignRouter)
app.use("/api/notes",noteRouter)
app.use("/api/quiz",quizRouter)




app.get("/",(req,res)=>{
    res.send("Hello From Server")
})

app.listen(port ,()=>{
    console.log("server Started");
    connectDb()
})
