/**
 * Created by cc on 2017/8/24.
 */
import merge from 'merge';
import pool from './index';
import Product from '../models/product';
import { jsonWrite, pageWrite } from '../utils/returnGenerator';

const productSQLMapping = {
  queryAll: 'SELECT * FROM `product`',
  queryById: 'SELECT * FROM `product` WHERE `productId` = ?',
  queryByName: 'SELECT * FROM `product` WHERE `productName` = ?',
  addProduct: 'INSERT INTO `game`.`product` (`productName`, `needScore`, `stock`) VALUES (?, ?, ?);'
}

export default {
  showProduct(req, res, callback, next) {
    pool.getConnection((error, connection) => {
      connection.query(productSQLMapping.queryAll, (err, dbResult) => {
        const result = [];
        if (dbResult) {
          dbResult.forEach((item, index, arr) => {
            result.push(new Product(item));
          });
        }

        const resResult = merge({
          code: '200',
          msg: '查询成功'
        }, { result: JSON.stringify(result) });

        callback && callback(err, resResult);
        jsonWrite(res, resResult);
        connection.release();
      });
    });
  },
  showProductById(req, res, callback, next) {
    const productId = +req.productId;
    pool.getConnection((error, connection) => {
      connection.query(productSQLMapping.queryById, productId, (err, dbResult) => {
        const resResult = {
          code: '200',
          msg: dbResult.length ? '查询成功' : '查无此商品ID',
          result: dbResult.length ? JSON.stringify(dbResult[0]) : ''
        };
        callback && callback(err, resResult);
        jsonWrite(res, resResult);
        connection.release();
      });
    });
  },
  addProduct(req, res, callback, next) {
    const { productName, needScore, stock } = req;
    pool.getConnection((error, connection) => {
      connection.query(productSQLMapping.addProduct, [productName, needScore, stock], (err, dbResult) => {
        /*
        * 增加成功后返回dbResult为{"fieldCount":0,"affectedRows":1,"insertId":8,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
        * affectedRows表示数据表中受影响的行数，数据插入成功则为1，失败则为0；在主键自增的情况下，insertId是数据插入成功后对应的主键id，如果主键不自增，则insertId为0。
        * 执行sql语句后，有3种结果：
          成功修改数据： affectedRows：1, changedRows:1
          要修改的数据与原数据相同： affectedRows：1, changedRows:0
          未找到需要修改的数据： affectedRows：0, changedRows:0
        * */
        jsonWrite(res, dbResult);
        connection.release();
      });
    });
  },
  // 插入不重复的商品名，简单callback方式
  addProductUnique(req, res, callback, next) {
    const { productName, needScore, stock } = req;
    pool.getConnection((error, connection) => {
      connection.query(productSQLMapping.queryByName, productName, (err, dbResult) => {
        if (dbResult.length) {
          console.log('重复了');
          const resResult = {
            code: '200',
            msg: '商品名不能重复，请核对后再录入',
            result: JSON.stringify(dbResult[0])
          };
          jsonWrite(res, resResult);
        } else {
          console.log('没有重复');
          this.addProduct(req, res, null, next);
        }
        connection.release();
      });
    });
  },
  // 插入不重复的商品名，promise方式
  addProductUnique2(req, res, callback, next){
    const { productName, needScore, stock } = req;
    var poolGetConnection = new Promise((resolve, reject) => {
      pool.getConnection((err, _connection) => {
        if (err) {
          return reject(err)
        }
        return resolve({_connection});
      });
    });
    var queryByName = (_connection, result) => {
      return new Promise((resolve, reject) => {
        _connection.query(productSQLMapping.queryByName, productName, (err, dbResult) => {
          if (dbResult.length) {
            console.log('重复了');
            const resResult = {
              code: '200',
              msg: '商品名不能重复，请核对后再录入',
              result: JSON.stringify(dbResult[0])
            };
            return reject({_connection, resResult});
          } else {
            console.log(dbResult.length);
            return resolve({_connection, dbResult});
          }
        })
      });
    };
    var addProductByName = (_connection, result) => {
      return new Promise((resolve, reject) => {
        _connection.query(productSQLMapping.addProduct, [productName, needScore, stock], (err, dbResult) => {
          console.log('插入', dbResult.affectedRows);
          if (dbResult.affectedRows) {
            console.log(dbResult);
            return resolve({_connection, dbResult});
          }
          return reject(err);
          connection.release();
        });
      });
    };
    poolGetConnection
    .then(data => queryByName(data._connection))
    .then(data => addProductByName(data._connection))
    .then(data => {
      console.log('最后的结果：', data.dbResult);
      jsonWrite(res, data.dbResult);
    })
    .catch(err => {jsonWrite(res, {msg: 'promise reject了'})})
  },



  // 插入不重复的商品名，async、await方式
  // 不考虑并发的问题，因为查询=》插入式继发的操作，所以用async不用考虑并发写法
  addProductUnique3(req, res, callback, next) {
    const { productName, needScore, stock } = req;

    async function poolGetConnection(){
      return await new Promise((resolve, reject) => {
        pool.getConnection((err, _connection) => {
          if (err) {
            const errorData = {
              error,
              msg: '连接数据库失败'
            };
            return reject(errorData);
          }
          const data = {_connection};
          return resolve(data);
        });
      });
    };

    async function queryByName({_connection, result}){
      return await new Promise((resolve, reject) => {
        _connection.query(productSQLMapping.queryByName, productName, (err, dbResult) => {
          if (dbResult.length) {
            console.log('重复了');
            const resResult = {
              code: '200',
              msg: '商品名不能重复，请核对后再录入',
              result: JSON.stringify(dbResult[0])
            };
            return reject({_connection, resResult});
          } else {
            return resolve({_connection, dbResult});
          }
        });
      });
    };

    async function addProductByName({_connection, result}){
      return await new Promise((resolve, reject) => {
        console.log('插入商品');
        _connection.query(productSQLMapping.addProduct, [productName, needScore, stock], (err, dbResult) => {
          if (dbResult && dbResult.affectedRows) {
            console.log(dbResult.affectedRows);
            console.log('居然resolve了？');
            return resolve({_connection, dbResult});
          } else {
            console.log('居然reject了？');
            return reject({err});            
          }
          connection.release();
        });
      });
    };


    poolGetConnection()
    .then(data => {
      console.log('查看商品是否存在', data);
      return queryByName(data)
    })
    .then(data => {
      console.log('调用增加商品方法', data);
      return addProductByName(data);
    })
    .catch(err => {
      console.log('catch', err);
      jsonWrite(res, {code: '500', msg: 'chsdfksdjfkj'})
    });

  }
};
