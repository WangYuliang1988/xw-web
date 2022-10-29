// 前端工程 xw-client 自动化部署脚本

const fs = require('fs');
const path = require('path');
const tar = require('tar'); // 用于文件打包压缩，参见：https://www.npmjs.com/package/tar
const dayjs = require('dayjs'); // 用于日期格式化，参见：https://www.npmjs.com/package/dayjs
const { exec, fastPut, login } = require('./utils/connect');
const localExec  = require('util').promisify(require('child_process').exec);
const { TGZ_FILE_NAME, REMOTE_DIST_FILE, REMOTE_BASE_DIR, REMOTE_SRC_DIR } = require('./utils/constants').client;

(async () => {
  console.log('Start deploying, please wait...');

  // 执行本地构建，生成待部署的文件
  await localExec('cd xw-client && npm run build');

  login(async () => {
    let loacalSrcDir = path.join(__dirname, 'xw-client', 'dist');
    let localDistFIle = path.join(__dirname, 'dist', TGZ_FILE_NAME);
    
    // 打包待部署的文件
    let filesToPack = fs.readdirSync(loacalSrcDir);
    tar.c({ sync: true, gzip: true, cwd: loacalSrcDir, file: localDistFIle }, filesToPack);
    // 删除服务器上老的tgz文件
    await exec(`rm -f ${REMOTE_DIST_FILE}`);
    // 上传新打包的tgz文件
    await fastPut(localDistFIle, REMOTE_DIST_FILE);
    // 在服务器代码目录创建带时间标记的子目录，并将tgz文件解压至该子目录中
    let timeDir = `xw-client-${dayjs().format('YYYY-MM-DD_HH.mm.ss')}`;
    await exec(`mkdir ${REMOTE_BASE_DIR}/${timeDir}`);
    await exec(`tar -xzvf ${REMOTE_DIST_FILE} -C ${REMOTE_BASE_DIR}/${timeDir}`);
    // 重置软连接
    await exec(`rm -f ${REMOTE_SRC_DIR}`);
    await exec(`ln -s ${REMOTE_BASE_DIR}/${timeDir} ${REMOTE_SRC_DIR}`);
  
    console.log('Succeed in deploying');
  });
})()