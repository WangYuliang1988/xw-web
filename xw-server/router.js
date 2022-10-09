// 解析 apis 目录下的文件并生成相应的 router 路径
// 涉及koa-router库，参考：https://github.com/koajs/router

const fs = require('fs');
const path = require('path');
const router = require('koa-router')();

// API 路径统一前缀
const API_PATH_PREFIX = '/reborn';

// 当引入该文件时，下列代码会直接运行
// 此处可以使用同步方法是因为只在服务启动时执行一次
let dir = path.join(__dirname, 'apis');
fs.readdirSync(dir).filter(f => {
  return f.endsWith('.js');
}).forEach(f => {
  let apis = require(path.join(dir, f));
  for (const api of apis) {
    let url = API_PATH_PREFIX + api.url;
    let method = api.method.toUpperCase();
    if (method === 'GET') {
      router.get(url, api.fn);
    } else if (method === 'POST') {
      router.post(url, api.fn);
    } else {
      console.log(`Invalid request ${api.url} with unkown method: ${api.method}.`);
    }
  }
});

module.exports = router