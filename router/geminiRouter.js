import express from "express";
import { GeminiPrompt } from "../model/geminiai.js";


const router = express.Router();

router.post('/prompt', async (req, res, next) => {
    try {
        const geminiResult = await GeminiPrompt("Oke, coba sebutkan nama saya");
        console.log("Send to responses")
        res.status(200).json({
            geminiResult: geminiResult
        })
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: `Error: ${error}` });
    }
})

export default router;