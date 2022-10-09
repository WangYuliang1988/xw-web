// 数据库 users 表对应的 model，可以处理 users 表的增删查改操作
// 涉及 Sequelize 库，参考：https://www.sequelize.cn/

const { sequelize, DataTypes } = require('../database');

const User = sequelize.define('users', {
  id: {
    primaryKey: true,
    type: DataTypes.STRING(64)
  },
  email: DataTypes.STRING(128),
  passwd: DataTypes.STRING(64),
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  name: DataTypes.STRING(64),
  image: DataTypes.STRING(512),
  createTime: {
    field: 'create_time',
    type: DataTypes.DOUBLE,
    defaultValue: Date.now() / 1000 // 数据库初建时存的时间是秒数而非毫秒数，为兼容老的数据需进行此处理
  }
}, {
  timestamps: false,
  indexes: [
    {
      name: 'idx_email',
      unique: true,
      fields: ['email']
    },
    {
      name: 'idx_create_time',
      unique: false,
      fields: ['create_time']
    }
  ]
});

module.exports = User;