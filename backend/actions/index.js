import mysql from 'mysql';
import merge from 'merge';

import { mysqlCon } from '../config/db';

const pool = mysql.createPool(merge({}, mysqlCon));

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

export default pool;
