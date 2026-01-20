import { askAi } from '../services/aiService.js';

export const chat = async (req, res) => {
    const { message, context } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Pass message and context (e.g. current page url) to service
        const result = await askAi(message, context);
        res.json(result);
    } catch (error) {
        console.error('AI Controller Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};