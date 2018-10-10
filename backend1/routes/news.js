import express from 'express'
import newsAction from '../actions/news'
import { jsonWrite, pageWrite } from '../utils/returnGenerator'
const router = express.Router()

router.all('/showAll', (req, res, next) => {
    newsAction.queryAll(req, res)
        .then(data => {
            // console.log(data)
            jsonWrite(res, data)
        })
})

module.exports = router;
