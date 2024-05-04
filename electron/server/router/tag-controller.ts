import { Request, Response } from 'express';
import { Tags } from '../model/tags';

// 新增一个标签
export const createTags = async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body;
    const result = await Tags.create({ name, color });
    res.status(200).json(result.toJSON());
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};