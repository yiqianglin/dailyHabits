// express 实例也能挂载到router上
// 但是貌似不会触发挂载的mount，只要被挂在到router实例上，如app上，才会触发这个mount事件

import express from 'express';

const admin = express();

admin.get('/', (req, res) => {
  console.log(admin.mountpath); // [ '/adm*n', '/manager' ]
  res.send('Admin Homepage');
});

const secret = express();
secret.get('/', (req, res) => {
  console.log(secret.mountpath); // /secr*t  mountpath属性是子程序（express实例）挂载的路径模式。  但是在router实例上并没有这个类似的属性
  res.send('Admin Secret');
});

admin.use('/secr*t', secret); // load the 'secret' router on '/secr*t', on the 'admin' sub app
// app.use(['/adm*n', '/manager'], admin); // load the 'admin' router on '/adm*n' and '/manager', on the parent app

admin.on('mount', (parent) => {
  console.log('admin子程序被挂载到主程序'); // 父程序对象作为参数，传递给回调方法
  // console.log(parent);
})

export default admin;
