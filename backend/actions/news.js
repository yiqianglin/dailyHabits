/**
 * Created by cc on 2017/8/24.
 */
import pool from './index'
import News from '../models/news'
import { jsonWrite, pageWrite } from '../utils/returnGenerator'

const newsSQLMapping = {
  queryAll: 'SELECT * FROM `news`'
}

export default {
    async queryAll () {
        return await new Promise((resolve, reject) => {
            pool.query(newsSQLMapping.queryAll, (err, dbResult) => {
                console.log(dbResult)
            })
        })
    }
}
