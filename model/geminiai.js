import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_APIKEY);

const GeminiPrompt = async (getPrompt = "Berikan saya berupa salam, singkat saja") => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(getPrompt);
  const response = await result.response;
  console.log("Gemini Answer: ", response.text());
  return { response }
}

export { GeminiPrompt }
