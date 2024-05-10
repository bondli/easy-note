import { Request, Response } from 'express';
import Sequelize, { Op } from 'sequelize';
import { Notebook } from '../model/notebook';

export const noteNumsFixed = async (req: Request, res: Response) => {
  try {
    const { id, op } = req.query;
    const result = await Notebook.findByPk(Number(id));

    if (result) {
      let updateNumCommand = '';
      if (op === 'add') {
        updateNumCommand = 'counts + 1';
      } else if (op === 'minus') {
        updateNumCommand = 'counts - 1';
      }
      result.update({
        counts: Sequelize.literal(updateNumCommand),
      }, {
        where: {
          id,
        },
      });
      res.status(200).json(result.toJSON());
    }else {
      res.json({ error: 'notebook not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};