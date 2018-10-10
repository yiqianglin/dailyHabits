import merge from 'merge';
import express from 'express';
import create_uptoken from '../config/qiniu';
import { jsonWrite, pageWrite } from '../utils/returnGenerator';

const router = express.Router();

router.all('/qiniuToken', (req, res, next) => {
	const result = { token: create_uptoken()};
	const resResult = merge({
	  code: '200',
	  msg: '获取token成功'
	}, { result: JSON.stringify(result) });

	jsonWrite(res, resResult);
});


export default router;
