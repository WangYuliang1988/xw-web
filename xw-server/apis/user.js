// 用户类相关接口处理，如注册、登录、分页获取用户列表等
// 接口前缀均为/api/users，由router.js添加到路由中

const crypto = require('crypto');
const User = require('../models/user');
const { putUserToCookie, deleteUserFromCookie } = require('../cookie');
const { APIError, parsePage, generateId } = require('../util');

const userApis = [{
  url: '/api/users', // 分页获取用户列表，/api/users?page=2&size=10
  method: 'GET',
  fn: async ctx => {
    let page = parsePage(ctx.query);

    let rs = await User.findAndCountAll({
      limit: page.pageSize,
      offset: page.pageSize * (page.currentPage - 1),
      order: [
        ['createTime', 'DESC']
      ]
    });

    let users = rs.rows.map(user => {
      user.passwd = '******';
      return user;
    });
    page.fulfillByTotalCount(rs.count);

    ctx.body = { users, page };
  }
}, {
  url: '/api/users/login', // 登录
  method: 'POST',
  fn: async ctx => {
    let email = ctx.request.body.email;
    let passwd = ctx.request.body.passwd; // 传递进来的密码参数是密码的SHA1值，数据库存储的是密码SHA1值的SHA1值

    if (!email) {
      throw new APIError('param:invalid_value', 'invalid email');
    }
    if (!passwd) {
      throw new APIError('param:invalid_value', 'invalid password');
    }

    let user = await User.findOne({
      where: {
        email: email
      }
    });

    if (!user) {
      throw new APIError('param:invalid_value', `user with email ${email} dosen't exist`);
    }

    if (user.passwd !== crypto.createHash('sha1').update(passwd).digest('hex')) {
      throw new APIError('param:invalid_value', 'incorrect password');
    }

    putUserToCookie(user, ctx);

    user.passwd = '******';
    ctx.body = user;
  }
}, {
  url: '/api/users/register', // 注册
  method: 'POST',
  fn: async ctx => {
    let name = ctx.request.body.name;
    let email = ctx.request.body.email;
    let passwd = ctx.request.body.passwd; // 传递进来的密码参数是密码的SHA1值，数据库存储的是密码SHA1值的SHA1值

    if (!name || !name.trim()) {
      throw new APIError('param:invalid_value', 'invalid name');
    }
    if (!email || !email.match(/^[a-zA-Z0-9\.\-_]+@[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+){1,4}$/)) {
      throw new APIError('param:invalid_value', 'invalid email');
    }
    if (!passwd || !passwd.match(/^[a-fA-F0-9]{40}$/)) {
      throw new APIError('param:invalid_value', 'invalid passwd');
    }

    let user = await User.findOne({
      where: {
        email: email
      }
    });

    if (user) {
      throw new APIError('param:invalid_value', `email ${email} is already in use`);
    }

    // 写入数据库
    user = await User.create({
      id: generateId(),
      name: name.trim(),
      email: email,
      passwd: crypto.createHash('sha1').update(passwd).digest('hex'),
      image: `/static/images/profile-${Math.floor(Math.random() * 9) + 1}.jpg`,
      createTime: Date.now() / 1000, // 数据库初建时存的时间是秒数而非毫秒数，为兼容老的数据需进行此处理
    });

    // 写入cookie
    putUserToCookie(user, ctx);

    user.passwd = '******';
    ctx.body = user;
  }
}, {
  url: '/api/users/logout', // 注销
  method: 'GET',
  fn: async ctx => {
    // 删除cookie
    deleteUserFromCookie(ctx)
    ctx.body = { logout: 'success' }
  }
}];

module.exports = userApis;