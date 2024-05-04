import { Sequelize } from 'sequelize';
import { DB_PATH } from '../config';

// 使用到的是sequelize，文档：
// https://github.com/demopark/sequelize-docs-Zh-CN/blob/v6/core-concepts/model-querying-basics.md
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DB_PATH,
});