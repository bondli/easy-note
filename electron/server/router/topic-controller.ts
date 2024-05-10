import { Request, Response } from 'express';
import Sequelize, { Op } from 'sequelize';
import { Topic } from '../model/topic';
import { Notebook } from '../model/notebook';

// 新增一条代办topic
export const createTopic = async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'];
  try {
    const { title, desc, noteId, tags, deadline, priority } = req.body;
    const result = await Topic.create({ title, desc, noteId, tags, deadline, priority, userId });
    if (result) {
      // 给对应的笔记本中增加代办记录数
      const noteBookResult = await Notebook.findByPk(Number(noteId));
      noteBookResult && noteBookResult.update({
        counts: Sequelize.literal('counts + 1'),
      }, {
        where: {
          id: noteId,
        },
      });
    }
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
      res.json({ error: 'Topic not found' });
    }
  } catch (error) {
    console.error('Error getting topic by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 查询代办列表
export const getTopics = async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'];
  try {
    const { noteId } = req.query;
    const where = {
      userId,
    };
    // 所有代办
    if (noteId === 'all') {
      where['status'] = 'undo';
    }
    // 所有已完成
    else if (noteId === 'done') {
      where['status'] = 'done';
    }
    // 今日到期
    else if (noteId === 'today') {
      where['deadline'] = {
        [Op.lt]: new Date(),
        [Op.gt]: new Date(new Date().getMilliseconds() - 24 * 60 * 60 * 1000)
      };
    }
    // 已删除
    else if (noteId === 'trash') {
      where['status'] = 'deleted';
    }
    // 正常查笔记本下的
    else {
      where['status'] = 'undo';
      where['noteId'] = noteId;
    }
    const { count, rows } = await Topic.findAndCountAll({
      where,
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

// 更新一条代办
export const updateTopic = async (req: Request, res: Response) => {
  try {
    const { id, op } = req.query;
    const { title, desc, noteId, status, tags, priority, deadline } = req.body;
    const result = await Topic.findByPk(Number(id));
    if (result) {
      await result.update({ title, desc, noteId, status, tags, priority, deadline });
      // 针对不同的操作类型，需要更新笔记本中的数量字段
      if (op === 'done' || op === 'delete' || op === 'restore') {
        let updateNumCommand = '';
        if (op === 'restore') {
          updateNumCommand = 'counts + 1';
        } else if (op === 'done' || op === 'delete') {
          updateNumCommand = 'counts - 1';
        }
        const noteBookResult = await Notebook.findByPk(Number(noteId));
        noteBookResult && noteBookResult.update({
          counts: Sequelize.literal(updateNumCommand),
        }, {
          where: {
            id: noteId,
          },
        });
      }
      res.json(result.toJSON());
    } else {
      res.json({ error: 'topic not found' });
    }
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 移动一个代办
export const moveTopic = async (req: Request, res: Response) => {
  try {
    const { id, status } = req.query;
    const { oldNoteId, newNoteId } = req.body;
    const result = await Topic.findByPk(Number(id));
    if (result) {
      await result.update({ noteId: Number(newNoteId) });
      if (status === 'undo') {
        // 只针对当前的代办还没有完结的情况下
        // 给新的笔记本中增加代办记录数，给老的笔记本减少代办记录数
        const newNoteBookResult = await Notebook.findByPk(Number(newNoteId));
        newNoteBookResult && newNoteBookResult.update({
          counts: Sequelize.literal('counts + 1'),
        }, {
          where: {
            id: Number(newNoteId),
          },
        });
        const oldNoteBookResult = await Notebook.findByPk(Number(oldNoteId));
        oldNoteBookResult && oldNoteBookResult.update({
          counts: Sequelize.literal('counts - 1'),
        }, {
          where: {
            id: Number(oldNoteId),
          },
        });
      }
      res.json(result.toJSON());
    } else {
      res.json({ error: 'topic not found' });
    }
  }
  catch(error) {
    console.error('Error moving topic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// 获取虚拟笔记本下的代办数量
export const getTopicCounts = async(req: Request, res: Response) => {
  const userId = req.headers['x-user-id'];
  try {
    const allTopicCount = await Topic.count({
      where: {
        userId,
        status: {
          [Op.eq]: 'undo'
        }
      },
    });
    const doneTopicCount = await Topic.count({
      where: {
        userId,
        status: {
          [Op.eq]: 'done'
        }
      },
    });
    const deletedTopicCount = await Topic.count({
      where: {
        userId,
        status: {
          [Op.eq]: 'deleted'
        }
      },
    });
    const todayDeadline = await Topic.count({
      where: {
        userId,
        deadline: {
          [Op.lt]: new Date(),
          [Op.gt]: new Date(new Date().getMilliseconds() - 24 * 60 * 60 * 1000)
        },
      }
    });
    res.json({
      all: allTopicCount || 0,
      today: todayDeadline || 0,
      done: doneTopicCount || 0,
      deleted: deletedTopicCount || 0,
    });
  } catch (error) {
    console.error('Error getting topicList by noteId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
