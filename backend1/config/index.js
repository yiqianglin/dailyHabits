const config = {
  env: process.env.NODE_ENV || 'local',   
  mysql_con: {
    local: {
      host: 'localhost',
      user: 'root',
      port: 3306,
      password: '123456',
      database: 'habits',
      charset: 'utf8'      
    }
  }
};

export default config

