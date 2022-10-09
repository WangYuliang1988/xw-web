// Koa 主文件，服务启动入口
// 涉及Koa库，参考：https://koa.bootcss.com/

const Koa = require('koa');
const router = require('./router');
const bodyParser = require('koa-bodyparser');
const { getUserFromCookie } = require('./cookie');

const app = new Koa();

// 记录请求日志
app.use(async (ctx, next) => {
  console.log(`${ctx.method} ${ctx.URL}`);

  let start = Date.now();
  await next();
  let end = Date.now();
  ctx.response.set('X-Response-Time', `${end - start}ms`);
});

// 统一处理异常
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    ctx.body = {
      error: e.error || 'internal:unknown_error',
      message: e.message || 'internal unknown error'
    };
    console.log(e);
  }
});

// 解析cookie并绑定用户信息
app.use(async (ctx, next) => {
  ctx.state.user = await getUserFromCookie(ctx);

  await next();
});

// 解析POST请求的request body
app.use(bodyParser());

// 添加路由，处理各个API请求
app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务
let port = 2046;
app.listen(port, () => {
  console.log(`Web server started at http://127.0.0.1:${port}`)
});