import express from 'express'
import newsAction from '../../actions/news'

const router = express.Router()

router.all('/showAll', (req, res, next) => {
    newsAction.queryAll(req, res, (err, resResult) => {
    console.log('结果是：', resResult)
  }, next)
})

export default router;
