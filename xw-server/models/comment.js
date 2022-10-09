// 数据库 comments 表对应的 model，可以处理 comments 表的增删查改操作
// 涉及 Sequelize 库，参考：https://www.sequelize.cn/

const { sequelize, DataTypes } = require('../database');

const Comment = sequelize.define('comments', {
  id: {
    primaryKey: true,
    type: DataTypes.STRING(64)
  },
  blogId: {
    field: 'blog_id',
    type: DataTypes.STRING(64)
  },
  userId: {
    field: 'user_id',
    type: DataTypes.STRING(64)
  },
  userName: {
    field: 'user_name',
    type: DataTypes.STRING(64)
  },
  userImage: {
    field: 'user_image',
    type: DataTypes.STRING(512)
  },
  content: DataTypes.TEXT('medium'),
  createTime: {
    field: 'create_time',
    type: DataTypes.DOUBLE,
    defaultValue: Date.now() / 1000 // 数据库初建时存的时间是秒数而非毫秒数，为兼容老的数据需进行此处理
  },
  // 以下字段均定义为虚拟字段，只为方便接口返回数据时使用，并不存储在数据库中
  html: DataTypes.VIRTUAL
}, {
  timestamps: false,
  indexes: [
    {
      name: 'idx_create_time',
      unique: false,
      fields: ['create_time']
    }
  ]
});

module.exports = Comment;