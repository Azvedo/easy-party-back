import { Request, Response } from 'express';
import getDbData from '../services/teste';

const getData = async (req: Request, res: Response) => {
  try {
    const data = await getDbData();
    res.json(data);
  } catch (error) {
    console.error('Error in getData controller:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

export default getData;