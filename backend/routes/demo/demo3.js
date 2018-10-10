// 本例子主要是体验req.app.settings
// {"code":"200","msg":"请求成功","result":{"app":{"x-powered-by":true,"etag":"weak","env":"development","query parser":"extended","subdomain offset":2,"trust proxy":1,"views":"E:\\xunlei\\game-app-henix\\backend\\views","jsonp callback name":"callback","view engine":"html"}}}

module.exports = function (req, res) {
  // res.send('The views directory is ' + req.app.get('views'));
  console.log(req.route);
  res.json({
    code: '200',
    msg: '请求成功',
    result: { app: req.app.settings }
  });
};
