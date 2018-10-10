// res.format(object)
// 进行内容协商，根据请求的对象中AcceptHTTP头部指定的接受内容。
// 它使用 req.accepts()来选择一个句柄来为请求服务，这些句柄按质量值进行排序。
// 如果这个头部没有指定，那么第一个方法默认被调用。当不匹配时，服务器将返回406"Not Acceptable"，或者调用default回调。

// 访问http://127.0.0.1:3000/demo/demo4/home/123_henix
// 当req被设置了Accept，例如Accept: 'image/png'，且携带了参数userId=2&name=henix
// 如果后端也对应设置了format
// 会根据对应的format给出不同的response

import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', {});
});

router.post('/home/:id', (req, res, next) => {
  console.log(req.params); // { id: '123_henix'}
  console.log(req.body); // { userId: 2, name: henix }
  res.setHeader('Content-Type', 'text/plain');
  res.cookie('cart', { username: 'henix' }, { maxAge: 90000 });
  res.format({
    'text/plain': () => {
      res.send('hey');
    }, // 如果req的头设置成*/*，则text/plain会被匹配
    'text/html': () => {
      res.send('<p>hey</p>');
    },
    'application/json': () => {
      res.send({ message: 'hey' });
    },
    default: () => {
      res.status(406).send('客户端希望接受到的内容类型，服务端不懂哦。'); // 自定义的406状态，如果没有default也会返回406状态的响应
    }
  });
  // return next();
});

export default router;
