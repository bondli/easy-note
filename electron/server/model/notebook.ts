import { DataTypes } from 'sequelize';
import { sequelize } from './index';

const Notebook = sequelize.define('Notebook', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  icon: {
    comment: 'icon',
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    comment: '笔记本名称',
    type: DataTypes.STRING,
    allowNull: false,
  },
  orders: {
    comment: '排序',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  counts: {
    comment: '笔记数量',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  userId: {
    comment: '用户id',
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  // 这是其他模型参数
  tableName: 'Notebook',
});

export { Notebook };
