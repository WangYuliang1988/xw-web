// 后端工程 xw-server 自动化部署脚本

const fs = require('fs');
const path = require('path');
const tar = require('tar'); // 用于文件打包压缩，参见：https://www.npmjs.com/package/tar
const dayjs = require('dayjs'); // 用于日期格式化，参见：https://www.npmjs.com/package/dayjs
const { exec, fastPut, login } = require('./utils/connect');
const { TGZ_FILE_NAME, REMOTE_DIST_FILE, REMOTE_BASE_DIR, REMOTE_SRC_DIR } = require('./utils/constants').server;

login(async () => {
  console.log('Start deploying, please wait...');

  let loacalSrcDir = path.join(__dirname, 'xw-server');
  let localDistFIle = path.join(__dirname, 'dist', TGZ_FILE_NAME);
  // 打包本地项目
  let ignoreFiles = ['node_modules', 'config-develop.js', 'README.md'];
  let filesToPack = fs.readdirSync(loacalSrcDir).filter(file => {
    return !ignoreFiles.includes(file);
  });
  tar.c({ sync: true, gzip: true, cwd: loacalSrcDir, file: localDistFIle }, filesToPack);
  // 删除服务器上老的tgz文件
  await exec(`rm -f ${REMOTE_DIST_FILE}`);
  // 上传新打包的tgz文件
  await fastPut(localDistFIle, REMOTE_DIST_FILE);
  // 在服务器代码目录创建带时间标记的子目录，并将tgz文件解压至该子目录中
  let timeDir = `xw-server-${dayjs().format('YYYY-MM-DD_HH.mm.ss')}`;
  await exec(`mkdir ${REMOTE_BASE_DIR}/${timeDir}`);
  await exec(`tar -xzvf ${REMOTE_DIST_FILE} -C ${REMOTE_BASE_DIR}/${timeDir}`);
  // 重置软连接
  await exec(`rm -f ${REMOTE_SRC_DIR}`);
  await exec(`ln -s ${REMOTE_BASE_DIR}/${timeDir} ${REMOTE_SRC_DIR}`);
  // 安装工程依赖
  await exec(`cd ${REMOTE_SRC_DIR}\nnpm ci`);
  // 启动或重启服务
  let rs = await exec(`pm2 pid xw`)
  if (rs > 0) {
    rs = await exec(`pm2 restart xw`);
  } else {
    rs = await exec(`NODE_ENV=production pm2 start ${REMOTE_SRC_DIR}/app.js --name xw --update-env`);
  }
  console.log(rs);
});