// 前端工程 xw-client-v2 和 xw-client-v3 自动化部署脚本

const fs = require('fs');
const path = require('path');
const tar = require('tar'); // 用于文件打包压缩，参见：https://www.npmjs.com/package/tar
const dayjs = require('dayjs'); // 用于日期格式化，参见：https://www.npmjs.com/package/dayjs
const { exec, fastPut, login } = require('./utils/connect');
const { question } = require("./utils/question");
const localExec  = require('util').promisify(require('child_process').exec);

(async () => {
  // 选择将要部署的工程，v2 代表 xw-client-v2，v3 代表 xw-client-v3
  let projectSuffix = await question('Choose project to deploy(v2 or v3): ');
  while (!['v2', 'v3'].includes(projectSuffix)) {
    projectSuffix = await question("Only v2 or v3 is valid, please choose again: ");
  }

  const projectName = "xw-client-" + projectSuffix;
  const { TGZ_FILE_NAME, REMOTE_DIST_FILE, REMOTE_BASE_DIR, REMOTE_SRC_DIR } = require("./utils/constants")[`client${projectSuffix}`];

  console.log("Start deploying, please wait...");

  // 执行本地构建，生成待部署的文件
  await localExec(`cd ${projectName} && npm run build`);

  login(async () => {
    let loacalSrcDir = path.join(__dirname, projectName, "dist");
    let localDistFile = path.join(__dirname, 'dist', TGZ_FILE_NAME );
    
    // 打包待部署的文件
    let filesToPack = fs.readdirSync(loacalSrcDir);
    tar.c({ sync: true, gzip: true, cwd: loacalSrcDir, file: localDistFile }, filesToPack);
    // 删除服务器上老的tgz文件
    await exec(`rm -f ${REMOTE_DIST_FILE}`);
    // 上传新打包的tgz文件
    await fastPut(localDistFile, REMOTE_DIST_FILE);
    // 在服务器代码目录创建带时间标记的子目录，并将tgz文件解压至该子目录中
    let timeDir = `xw-client-${projectSuffix}-${dayjs().format('YYYY-MM-DD_HH.mm.ss')}`;
    await exec(`mkdir ${REMOTE_BASE_DIR}/${timeDir}`);
    await exec(`tar -xzvf ${REMOTE_DIST_FILE} -C ${REMOTE_BASE_DIR}/${timeDir}`);
    // 重置软连接
    await exec(`rm -f ${REMOTE_SRC_DIR}`);
    await exec(`ln -s ${REMOTE_BASE_DIR}/${timeDir} ${REMOTE_SRC_DIR}`);
  
    console.log('Succeed in deploying');
  });
})()