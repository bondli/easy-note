import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { SERVER_PORT } from './config';
import { sequelize } from './model/index';
import router from './router/index';

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(router);

const startServer = async () => {
  app.all('*', (req, res, next) => {
    res.header('X-Powered-By', 'Easy-Note');
    next();
  });

  try {
    // 测试一下数据库是否能连上
    sequelize.authenticate().then(() => {
      console.log('Connection has been established successfully.');
    }).catch((err) => {
      console.error('Unable to connect to the database:', err);
    });
    // 启动服务器前同步所有模型
    await sequelize.sync();
    // 启动服务器
    app.listen(SERVER_PORT, () => {
      console.log(`Server is running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

export default startServer;
