import express from "express";
import { generateQuiz } from "../controller/quizController.js";

const quizRouter = express.Router();

quizRouter.post("/generate", generateQuiz);

export default quizRouter;
