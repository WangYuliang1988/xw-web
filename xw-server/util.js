// 通用工具方法

const crypto = require('crypto');

/**
 * 接口异常类
 */
class APIError {
  constructor(error, message) {
    this.error = error;
    this.message = message;
  }
}

/**
 * 分页类
 */
class Page {
  // 创建分页对象时默认totalPage、hasNext为无效值
  constructor(currentPage, pageSize) {
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    this.hasPrevious = currentPage > 1;
    this.totalPage = -1;
    this.hasNext = false;
  }

  // 通过调用该方法将totalPage、hasNext设为有效值
  fulfillByTotalCount(totalCount) {
    this.totalPage = parseInt(totalCount / this.pageSize) + (totalCount % this.pageSize > 0 ? 1 : 0);
    this.hasNext = this.currentPage < this.totalPage;
  }
}

/**
 * 判断是否undefined
 * 
 * @param {*} o 判断对象
 * @returns 若为undefined则返回true，否则返回false
 */
function isUndefined(o) {
  return typeof o === 'undefined';
}

/**
 * 生成唯一id，供数据库插入数据时设置主键id使用
 * @returns id字符串
 */
function generateId() {
  return `${Date.now()}`.padStart(15,'0') + crypto.randomUUID().replace(/-/g, '') + '000';
}

/**
 * 解析URL中包含的分页参数，生成分页对象
 * 注意该方法返回的分页对象中totalPage、hasNext为无效值，需待获取到全部数据条数后再调用fulfillByTotalCount进行更新
 * 
 * @param {Object} query 
 * @returns Page对象
 */
function parsePage(query) {
  if (isUndefined(query.page) && isUndefined(query.size)) { // 请求链接中未传入分页参数，则设默认值
    return new Page(1, 10);
  }

  let currentPage = parseInt(query.page);
  let pageSize = parseInt(query.size);

  if (isNaN(currentPage) || currentPage <= 0) {
    throw new APIError('param:invalid_value', `page value '${query.page}' is invalid`);
  }
  if (isNaN(pageSize) || pageSize <= 0) {
    throw new APIError('param:invalid_value', `size value '${query.size}' is invalid`);
  }

  return new Page(currentPage, pageSize);
}

/**
 * 处理待网页展示的文本，避免代码注入并处理换行
 * 
 * @param {String} text 原始文本
 * @returns 处理后的文本
 */
function transformText(text) {
  // 对文本中的HTML标识符号进行转义，避免代码注入
  text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // 将文中的换行标识'\n'替换为<p></p>标签，实现换行的并可进行样式控制
  let rs = '';
  let paragraphs = text.split('\n');
  for (const paragraph of paragraphs) {
    rs += `<p>${paragraph}</p>`
  }
  return rs;
}

/**
 * 检查用户是否为管理员，若是则不处理，若否则抛出异常
 * 
 * @param {Object} user 
 */
function checkAdmin(user) {
  if (!user || !user.admin) {
    throw new APIError('permission:no_permission', 'only administrators have permission');
  }
}

module.exports = { APIError, Page, isUndefined, generateId, parsePage, transformText, checkAdmin };