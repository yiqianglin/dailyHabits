import mysql from 'mysql'
import merge from 'merge'

import config from '../config/index'

const pool = mysql.createPool(merge({}, config.mysql_con.local))

pool.getConnection((err, connection) => {
  if (err) {
    console.log('连接数据库失败')
  }
});

/*
pool.on('connection', function (connection) {
 console.log('pool on connection');
 });

 pool.on('acquire', function (connection) {
 console.log('pool on acquire');
 });
 */

export default pool
