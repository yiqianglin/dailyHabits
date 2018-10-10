// 向前台返回JSON方法的简单封装
const jsonWrite = function (res, result) {
  if (typeof result === 'undefined') {
    res.json({
      code: '-1',
      msg: '网络繁忙，请稍后再试'
    });
  } else {
    res.json(result);
  }
};

const pageWrite = function (res, result, pageUri) {
  res.render(pageUri, result);
};

export {
  jsonWrite,
  pageWrite
};
