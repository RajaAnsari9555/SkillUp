import { GoogleGenAI } from "@google/genai";

export const generateQuiz = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text;

    return res.status(200).json({ text });
  } catch (error) {
    return res.status(500).json({ message: `Quiz generation failed: ${error.message}` });
  }
};
