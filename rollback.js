// 后端工程 xw-server 自动化回滚脚本

const { question } = require('./utils/question');
const { exec, login } = require('./utils/connect');
const { REMOTE_BASE_DIR, REMOTE_SRC_DIR } = require('./utils/constants');

login(async () => {
  // 获取可用工程列表，列表按工程名称正排序
  let rawPros = await exec(`ls ${REMOTE_BASE_DIR} -p -1`);
  let proArr = rawPros.split('\n').filter(item => {
    return item.startsWith('xw-server-') && item.endsWith('/');
  }).map(item => {
    return item.substring(0, item.length - 1);
  });

  // 获取当前xw-server软连接指向的目录
  let rawLink = await exec(`ls -l ${REMOTE_SRC_DIR}`);
  let linkArr = rawLink.replace('\n', '').split(' -> ');
  if (linkArr.length != 2) throw Error(`Error: '${REMOTE_SRC_DIR}' is not a symbol link.`);
  let current = linkArr[1].replace(`${REMOTE_BASE_DIR}/`, '');

  // 获取上一版本对应的目录
  let index = proArr.indexOf(current);
  if (index === -1) throw Error(`Error: symbol link '${REMOTE_SRC_DIR}' is invalid.`);
  if (index - 1 < 0) throw Error('Error: alreay the oldest version.');
  let previous = proArr[index - 1];

  // 要求确认是否进行回退操作
  console.log('==================================================');
  console.log(`Current       --->  ${current}`);
  console.log(`Rollback to   --->  ${previous}`);
  console.log('==================================================');
  let choice = await question('Current will be deleted, continue? Y/N\n');

  if (choice.toUpperCase() !== 'Y') {
    console.log('Rollback canceled.');
  } else {
    // 重置软连接
    await exec(`rm -f ${REMOTE_SRC_DIR}`);
    await exec(`ln -s ${REMOTE_BASE_DIR}/${previous} ${REMOTE_SRC_DIR}`);

    // 启动或重启服务
    let rs = await exec(`pm2 pid xw`);
    if (rs > 0) {
      rs = await exec(`pm2 restart xw`);
    } else {
      rs = await exec(`NODE_ENV=production pm2 start ${REMOTE_SRC_DIR}/app.js --name xw --update-env`);
    }
    console.log(rs);

    // 删除当前版本对应目录
    await exec(`rm -rf ${REMOTE_BASE_DIR}/${current}`);
  }
});