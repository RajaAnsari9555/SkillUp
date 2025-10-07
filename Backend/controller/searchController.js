import Course from "../model/coursemodel.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

export const searchWithAi = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ message: "Search  query is required" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = ` You are intelligent assistant for an LMS platform. a user will type any query about what they want to learn. Your task is to understand the intent and return one **most relevant Keyword** from the following list of course categories and levels:
    
    -App Development
    -AI/ML
    -AI Tools
    -Data Science
    -Data Analytics
    -Ethical Hacking
    -web Development
    -other
    -Beginner
    -Intermediate
    -Advance

    only reply with one single keyword from the list above that best matches the query. Do not explain anything no extra text.

    Query;${input}
    `
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const keyword = response.text

    const course = await Course.find({
      isPublished: true,
      $or: [
        { title: { $regex: input, $options: "i" } },
        { subTitle: { $regex: input, $options: "i" } },
        { description: { $regex: input, $options: "i" } },
        { category: { $regex: input, $options: "i" } },
        { level: { $regex: input, $options: "i" } },
      ],
    });

    if(course.length > 0){
        return res.status(200).json(course)
    }
    else{
         const course = await Course.find({
      isPublished: true,
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { subTitle: { $regex:  keyword, $options: "i" } },
        { description: { $regex:  keyword, $options: "i" } },
        { category: { $regex:  keyword, $options: "i" } },
        { level: { $regex:  keyword, $options: "i" } },
      ],
    });
    return res.status(200).json(course)
    }

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: `failed to search ${error}` });
  }
};
