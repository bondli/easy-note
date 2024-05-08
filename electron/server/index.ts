import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from 'electron-log';
import { sequelize } from './model/index';
import router from './router/index';

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(router);

app.all('*', (req, res, next) => {
  res.header('X-Powered-By', 'Easy-Note');
  next();
});

(async () => {
  try {
    // 测试一下数据库是否能连上
    sequelize.authenticate().then(() => {
      logger.info('Connection has been established successfully.');
    }).catch((err) => {
      logger.error('Unable to connect to the database:', err);
    });
    // 启动服务器前同步所有模型
    await sequelize.sync();
    // 启动服务器
    app.listen(5432, () => {
      logger.info('Server is running on port 5432');
    });
  } catch (error) {
    logger.error('Error starting server:', error);
  }
})();
