import express from 'express';
import usersAction from '../../actions/users';

const router = express.Router();

// 定义错误中间件
function logErrors(err, req, res, next) {
  console.error('报错啦:', err.stack);
  next(err);
}

// 该路由使用的中间件
router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

// 错误中间件
router.use(logErrors);

// 直接在action中返回后端的页面
router.all('/showUser', (req, res, next) => {
  usersAction.showUser(req, res, null, next);
});

router.all('/showUserById', (req, res, next) => {
  usersAction.showUserById({ userId: 1 }, res, null, next);
});

export default router;
