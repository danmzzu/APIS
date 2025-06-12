require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error('Error: GOOGLE_API_KEY is not defined.');
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);

app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
    const { instruction, question } = req.body;

    if (!instruction || !question) {
        return res.status(400).json({ error: 'The parameters "instruction" and "question" are required.' });
    }

    try {
        const modelWithSystemInstruction = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-001",
            systemInstruction: instruction
        });

        const result = await modelWithSystemInstruction.generateContent(question);
        const text = result.response.text();

        res.json({ response: text });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ 
            error: 'Error processing request with Gemini.', 
            details: error.message,
            apiError: error.statusText 
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});