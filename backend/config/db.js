const db = {
  mysql_con: {
    host: 'localhost',
    user: 'root',
	port: 3306,
    password: '123456',
    database: 'habits',
    charset: 'utf8'
  }
};

// export default db; 这样无法解构import
// 
// 

export const mysqlCon = db.mysql_con;
