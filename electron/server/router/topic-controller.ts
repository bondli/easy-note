import { Request, Response } from 'express';
import { Topic } from '../model/topic';

// 新增一条代办topic
export const createTopic = async (req: Request, res: Response) => {
  try {
    const { title, desc, noteId, tags, deadline, priority } = req.body;
    const result = await Topic.create({ title, desc, noteId, tags, deadline, priority });
    res.status(200).json(result.toJSON());
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 查询一条代办详情
export const getTopicInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const result = await Topic.findByPk(Number(id));
    if (result) {
      res.json(result.toJSON());
    } else {
      res.status(404).json({ error: 'Topic not found' });
    }
  } catch (error) {
    console.error('Error getting topic by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 根据笔记本ID查询代办列表
export const getTopicsByNoteId = async (req: Request, res: Response) => {
  try {
    const { noteId } = req.query;
    const { count, rows } = await Topic.findAndCountAll({
      where: {
        noteId,
      },
      order: [['createdAt', 'DESC']],
    });
    res.json({
      count: count || 0,
      data: rows || [],
    });
  } catch (error) {
    console.error('Error getting topicList by noteId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 根据tagId查询代办列表
export const getTopicsByTagId = async (req: Request, res: Response) => {
  try {
    const { tagId } = req.query;
    const { count, rows } = await Topic.findAndCountAll({
      where: {
        tagId,
      },
      order: [['createdAt', 'DESC']],
    });
    res.json({
      count: count || 0,
      data: rows || [],
    });
  } catch (error) {
    console.error('Error getting topicList by tagId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 根据状态查询代办列表
export const getTopicsByStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const { count, rows } = await Topic.findAndCountAll({
      where: {
        status,
      },
      order: [['createdAt', 'DESC']],
    });
    res.json({
      count: count || 0,
      data: rows || [],
    });
  } catch (error) {
    console.error('Error getting topicList by status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新一条代办
export const updateTopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const { title, desc, noteId, status, tags, priority, deadline } = req.body;
    const result = await Topic.findByPk(Number(id));
    if (result) {
      await result.update({ title, desc, noteId, status, tags, priority, deadline });
      res.json(result.toJSON());
    } else {
      res.status(404).json({ error: 'topic not found' });
    }
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 删除一条代办
export const deleteTopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const result = await Topic.findByPk(Number(id));
    if (result) {
      await result.destroy();
      res.json({ message: 'topic deleted successfully' });
    } else {
      res.status(404).json({ error: 'topic not found' });
    }
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
