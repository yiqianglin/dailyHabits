import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import ejs from 'ejs';
// import demo from './routes/demo/index';
// import demo1 from './routes/demo/demo1';
// import product from './routes/game/product';
import news from './routes/news'
import configRoute from './routes/configRoute';
// 拉取配置，例如七牛token

const app = express();
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.set('trust proxy', 1);

app.use(helmet());
// 为程序托管位于程序目录下的public目录下的静态资源：
app.use(express.static('public'));
// 默认情况下，req.body是undefined；需要用中间件进行解析
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json

// cors 解决跨域问题
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

// app.use('/demo', demo);
// app.use('/demo1', demo1);
// app.use('/product', product);
// app.use('/configRoute', configRoute);
app.use('/news', news)

app.use('*', (req, res) => {
  res.status(404).send('404 Not Found by Game Server Express');
})

app.listen(3000, () => {
  console.log('Server runs on port 3000.');
});
