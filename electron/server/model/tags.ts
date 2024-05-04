import { DataTypes } from 'sequelize';
import { sequelize } from './index';

const Tags = sequelize.define('Tags', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  color: {
    comment: '标签颜色',
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    comment: '标签名称',
    type: DataTypes.STRING,
    allowNull: false,
  },
  counts: {
    comment: '笔记数量',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  // 这是其他模型参数
  tableName: 'Tags',
});

export { Tags };
