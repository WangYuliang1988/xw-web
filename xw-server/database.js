// 数据库初始化相关操作
// 涉及Sequelize库，参考：https://www.sequelize.cn/

const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

// NODE_ENV 是在操作系统环境变量中设置的变量，生产环境设为production，开发环境默认不设置
let env = process.env.NODE_ENV || 'develop';
let config = require(path.join(__dirname, `config-${env}`));

// 初始化数据库连接
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: 'mysql',
  pool: {
    max: 6,
    min: 0,
    idle: 3000
  }
});

module.exports = { sequelize, DataTypes };