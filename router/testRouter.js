import express from "express";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const response = await fetch('https://notes-api.dicoding.dev/v2/notes');
        const data = await response.json();

        res.status(200).json({
            data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


export default router;