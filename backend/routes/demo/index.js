import express from 'express';
import demo1 from './demo1';
import demo2 from './demo2';
import demo3 from './demo3';
import demo4 from './demo4';
import demo5 from './demo5';

const router = express.Router();

// router.use('/demo1', demo1);
router.use('/demo2', demo2);
router.use('/demo3', demo3);
router.use('/demo4', demo4);
router.use('/demo5', demo5);

export default router;
