/**
 * Created by cc on 2017/8/24.
 */
import pool from './index'
import News from '../models/news'

const newsSQLMapping = {
  queryAll: 'SELECT * FROM `news` LIMIT 2,20;'
}

export default {
    async queryAll (req, res) {
        return await new Promise((resolve, reject) => {
            pool.query(newsSQLMapping.queryAll, (err, dbResult) => {
                if (err) {
                    reject(err)
                }
                resolve(dbResult)
            })
        })
    }
}
