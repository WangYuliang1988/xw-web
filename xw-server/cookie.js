// 登录业务 cookie 处理工具类

const crypto = require('crypto');
const User = require('./models/user');

const COOKIE_NAME = 'websession';
const COOKIE_MAX_AGE = 86400000; // 24小时

function createCryptoText(user, expires) {
  return crypto.createHash('sha1').update(`${user.id}-${user.passwd}-${expires}-${COOKIE_NAME}`).digest('hex');
}

/**
 * 将当前登录的用户信息存入cookie
 * 
 * @param {Object} user 
 * @param {Object} ctx 
 */
function putUserToCookie(user, ctx) {
  let expires = Date.now() + COOKIE_MAX_AGE;
  let cryptoText = createCryptoText(user, expires);
  let cookie = `${user.id}-${expires}-${cryptoText}`;

  ctx.cookies.set(COOKIE_NAME, cookie, {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true
  });
}

/**
 * 从cookie中取出当前登录用户信息
 * 
 * @param {Object} ctx 
 * @returns 当前登录的用户信息
 */
async function getUserFromCookie(ctx) {
  let cookie = ctx.cookies.get(COOKIE_NAME);

  if (!cookie || cookie.split('-').length !== 3) return null;

  let [uid, expires, sha1] = cookie.split('-');

  if (expires < Date.now()) return null;

  let user = await User.findOne({
    where: {
      id: uid
    }
  });

  if (!user || sha1 !== createCryptoText(user, expires)) return null;

  user.passwd = '******';
  return user;
}

/**
 * 从cookie中删除当前登录用户信息
 * @param {Object} ctx 
 */
function deleteUserFromCookie(ctx) {
  ctx.cookies.set(COOKIE_NAME, '', {
    maxAge: 0,
    httpOnly: true
  });
}

module.exports = { COOKIE_NAME, putUserToCookie, getUserFromCookie, deleteUserFromCookie }