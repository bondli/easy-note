import { Request, Response } from 'express';
import { User } from '../model/user';

// 新增一个用户
export const createUser = async (req: Request, res: Response) => {
  try {
    const { avatar, name, email } = req.body;
    const result = await User.create({ avatar, name, email });
    res.status(200).json(result.toJSON());
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 查询用户详情
export const getNoteInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const result = await User.findByPk(Number(id));
    if (result) {
      res.json(result.toJSON());
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error getting User by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新用户信息
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const { avatar, name, email } = req.body;
    const result = await User.findByPk(Number(id));
    if (result) {
      await result.update({ avatar, name, email });
      res.json(result.toJSON());
    } else {
      res.status(404).json({ error: 'user not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
