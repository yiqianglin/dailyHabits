/**
 * Created by cc on 2017/8/24.
 */
import merge from 'merge';
import async from 'async';
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
  addProductUnique(req, res, callback, next) {
    const { productName, needScore, stock } = req;

    function poolGetConnection(cb) {
	    pool.getConnection((err, connection) => {
        if (err) {
          return cb(new Error('数据库连接错误'));
        }
        return cb(null, {_connection: connection});
	    });
    };

    function queryByName({_connection, dbResult}, cb) {
      _connection.query(productSQLMapping.queryByName, productName, (err, dbResult) => {
        if (dbResult.length) {
          return cb(new Error('商品名不能重复，请核对后再录入'));
        }
        return cb(null, {_connection, dbResult});
      });
    };

    function addProductByName({_connection, dbResult}, cb) {
      _connection.query(productSQLMapping.addProduct, [productName, needScore, stock], (err, dbResult) => {
        if (dbResult && dbResult.affectedRows) {
          return cb(null, {_connection, dbResult});
        }
        return cb(new Error('插入失败'));
        connection.release();
      });
    }

    async.waterfall([
      poolGetConnection,
      queryByName,
      addProductByName
    ], (err, result) => { // 当所有回调完成，才会调用下面的回调。或者其中一个出错了，则会终止，也会进入下面的回调。
      if(err) {
        console.log('there is An error', err.message);
      } else {
        // 这result是最后一个cb传出来的值
        console.log('result', result);
      }
    })
  }
};
