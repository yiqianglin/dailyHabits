// router.param(name, callback)
// 给路由参数添加回调触发器，这里的name是参数名，function是回调方法。

import express from 'express';

const router = express.Router();

// 例子一
// 访问http://localhost:3000/demo/demo2/id_04
// CALLED ONLY ONCE id_04 id
// although this matches
// and this mathces too
// 对于Param的回调定义的路由来说，他们是局部的。它们不会被挂载的app或者路由继承。所以，定义在router上的param回调只有是在router上的路由具有这个路由参数时才起作用。
// 在定义param的路由上，param回调都是第一个被调用的，它们在一个请求-响应循环中都会被调用一次并且只有一次，即使多个路由都匹配

// router.get('/:id', function(req, res, next) {
//     console.log('although this matches');
//     next();
// });
// router.param('id', function(req, res, next, paramsValue, paramsName) {
//     console.log('CALLED ONLY ONCE', paramsValue, paramsName);
//     next();
// });
// router.get('/:id', function(req, res) {
//     console.log('and this mathces too');
//     res.end();
// });

// 例子二（很奇怪是官网上的param数组不行，只有单个string类型才可以匹配并执行这个中间件）
// 访问http://localhost:3000/demo/demo2/id_04/page_01
// although this matches
// /demo/demo2/id_04/page_01
// /demo/demo2
// /id_04/page_01
// and this matches too

router.param(['id', 'page'], (req, res, next, value) => {
  console.log('demo2, router.param只被执行一次', value);
  next();
});
router.get('/user/:id/:page', (req, res, next) => {
  console.log('although this matches');
  console.log(req.originalUrl);
  console.log(req.baseUrl);
  console.log(req.path);
  next();
});
router.get('/user/:id/:page', (req, res, next) => {
  console.log('and this matches too');
  res.end();
});

export default router;
