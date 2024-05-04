import { Request, Response } from 'express';
import { Notebook } from '../model/notebook';

// 新增一个笔记本
export const createNote = async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'];
  try {
    const { icon, name, orders } = req.body;
    const result = await Notebook.create({ icon, name, orders, userId });
    res.status(200).json(result.toJSON());
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 查询一个笔记本详情
export const getNoteInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const result = await Notebook.findByPk(Number(id));
    if (result) {
      res.json(result.toJSON());
    } else {
      res.status(404).json({ error: 'Notebook not found' });
    }
  } catch (error) {
    console.error('Error getting notebook by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 查询所有笔记本
export const getNotes = async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'];
  try {
    const { count, rows } = await Notebook.findAndCountAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    res.json({
      count: count || 0,
      data: rows || [],
    });
  } catch (error) {
    console.error('Error getting notebooks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新笔记本
export const updateNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const { icon, name, orders } = req.body;
    const result = await Notebook.findByPk(Number(id));
    if (result) {
      await result.update({ icon, name, orders });
      res.json(result.toJSON());
    } else {
      res.status(404).json({ error: 'notebook not found' });
    }
  } catch (error) {
    console.error('Error updating notebook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 删除笔记本
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const result = await Notebook.findByPk(Number(id));
    if (result) {
      await result.destroy();
      res.json({ message: 'notebook deleted successfully' });
    } else {
      res.status(404).json({ error: 'notebook not found' });
    }
  } catch (error) {
    console.error('Error deleting notebook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
