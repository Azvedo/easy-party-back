// src/controllers/OpenAIController.ts
import { Request, Response } from 'express';
import { getOpenAIResponse } from '../utils/openAI';

const askOpenAI = async (req: Request, res: Response) => {
    try {
        const { prompt }: { prompt: string } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Call the service to get the OpenAI response
        const response = await getOpenAIResponse(prompt);

        // Send the response back to the client
        res.json({ response });
    } catch (error) {
        console.error('Error in askOpenAI controller:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export default askOpenAI;