module.exports = {
  development: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DBNAME,
    host: process.env.MYSQL_HOST,
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    use_env_variable: "mysql://bwp5auq945lv1g23:t6wp02bcadefoawa@h40lg7qyub2umdvb.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/z6bg9w9potfaw3jx",
    dialect: "mysql"
  }
};
