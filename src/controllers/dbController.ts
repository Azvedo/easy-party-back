import { Request, Response } from 'express';
import getDbData from '../services/getData';

const getData = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const data = await getDbData({ prompt });
    res.json(data);
  } catch (error) {
    console.error('Error in getData controller:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

export default getData;