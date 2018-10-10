/**
 * Created by cc on 2017/8/24.
 */
import merge from 'merge';
import async from 'async';
import pool from './index';
import Product from '../models/product';
import { jsonWrite, pageWrite } from '../utils/returnGenerator';

const productSQLMapping = {
  // queryByName: 'SELECT * FROM `product` WHERE `productName` = ?',
  changeStock1: 'UPDATE `game`.`product` SET `stock`=? WHERE `productName` = ?',
  changeStock2: 'UPDATE `game`.`product` SET `stock`=? WHERE `productName` = ?',
}

// 并发sql语句处理
export default {
  // 简单的callback
  // 弊端，比较难去实现多个执行成功后的回调
  changeStockCallback(req, res, callback, next) {
    const { productName, needScore, stock } = req;
    pool.getConnection((error, connection) => {
      connection.query(productSQLMapping.changeStock1, [21, "名字很奇怪1"], (err, dbResult) => {
        console.log(dbResult);
        console.log(err);
        connection.release();
      });
    });

    pool.getConnection((error, connection) => {
      connection.query(productSQLMapping.changeStock2, [22, "名字很奇怪2"], (err, dbResult) => {
        console.log(dbResult);
        console.log(err);
        connection.release();
      });
    });
  },
  // promise方法
  // 优势：可以使用promise.all来定义所有都成功的回调
  changeStockPromise(req, res, callback, next) {
    const { productName, needScore, stock } = req;
    const changeStock1 = function() {
      return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
          connection.query(productSQLMapping.changeStock1, [21, "名字很奇怪3"], (err, dbResult) => {
            const resResult = {};
            if (error) {
              resResult.code = '500';
              resResult.msg = '数据库操作异常';
              return reject({resResult});
            }
            resResult.code = '200';
            console.log('dbResult1', dbResult);
            if (dbResult.affectedRows && dbResult.changedRows) {
              resResult.msg = '修改成功，数据也有变化';
            } else if (dbResult.affectedRows && !dbResult.changedRows) {
              resResult.msg = '修改成功，但是数据还是一样啊~';
            } else if (!dbResult.affectedRows && !dbResult.changedRows) {
              resResult.msg = '没有找到需要修改的数据';
            }
            return resolve({resResult});
          });
        });
      });
    }

    const changeStock2 = function() {
      return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
          connection.query(productSQLMapping.changeStock2, [22, "名字很奇怪4"], (err, dbResult) => {
            const resResult = {};
            if (error) {
              resResult.code = '500';
              resResult.msg = '数据库操作异常';
              return reject({resResult});
            }
            resResult.code = '200';
            console.log('dbResult2', dbResult);
            if (dbResult.affectedRows && dbResult.changedRows) {
              resResult.msg = '修改成功，数据也有变化';
            } else if (dbResult.affectedRows && !dbResult.changedRows) {
              resResult.msg = '修改成功，但是数据还是一样啊~';
            } else if (!dbResult.affectedRows && !dbResult.changedRows) {
              resResult.msg = '没有找到需要修改的数据';
            }
            return resolve({resResult});
          });
        });
      });
    };

    Promise.all([
      changeStock1(),
      changeStock2()
    ])
    .then(([result1, result2]) => {
      console.log('result1', result1);
      console.log('result2', result2);
    })
    .catch((err) => console.log(err))
  },

  // async方法
  changeStockAsync(req, res, callback, next) {
    const { productName, needScore, stock } = req;
    async.parallel({
      one: function(cb){
        pool.getConnection((error, connection) => {
          connection.query(productSQLMapping.changeStock2, [22, "名字很奇怪1"], (err, dbResult) => {
            cb(null, dbResult);
            connection.release();
          });
        });
      },
      two: function(cb){
        pool.getConnection((error, connection) => {
          connection.query(productSQLMapping.changeStock2, [22, "名字很奇怪2"], (err, dbResult) => {
            cb(null, dbResult);
            connection.release();
          });
        });
      }
    }, function(err, results){
      if (err){
        console.log('err', err);
      } else {
        console.log('results', results);
      }
    });
  }
};
