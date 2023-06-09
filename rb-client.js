// 前端工程 xw-client-v2 和 xw-client-v3 自动化回滚脚本

const { question } = require('./utils/question');
const { exec, login } = require('./utils/connect');

(async () => {
  // 选择将要回滚的工程，v2 代表 xw-client-v2，v3 代表 xw-client-v3
  let projectSuffix = await question("Choose project to rollback(v2 or v3): ");
  while (!["v2", "v3"].includes(projectSuffix)) {
    projectSuffix = await question("Only v2 or v3 is valid, please choose again: ");
  }

  const { REMOTE_BASE_DIR, REMOTE_SRC_DIR } = require("./utils/constants")[`client${projectSuffix}`];

  login(async () => {
    // 获取可用工程列表，列表按工程名称正排序
    let rawPros = await exec(`ls ${REMOTE_BASE_DIR} -p -1`);
    let proArr = rawPros
      .split("\n")
      .filter((item) => {
        return item.startsWith(`xw-client-${projectSuffix}-`) && item.endsWith("/");
      })
      .map((item) => {
        return item.substring(0, item.length - 1);
      });

    // 获取当前工程软连接指向的目录
    let rawLink = await exec(`ls -l ${REMOTE_SRC_DIR}`);
    let linkArr = rawLink.replace("\n", "").split(" -> ");
    if (linkArr.length != 2)
      throw Error(`Error: '${REMOTE_SRC_DIR}' is not a symbol link.`);
    let current = linkArr[1].replace(`${REMOTE_BASE_DIR}/`, "");

    // 获取上一版本对应的目录
    let index = proArr.indexOf(current);
    if (index === -1)
      throw Error(`Error: symbol link '${REMOTE_SRC_DIR}' is invalid.`);
    if (index - 1 < 0) throw Error("Error: alreay the oldest version.");
    let previous = proArr[index - 1];

    // 要求确认是否进行回退操作
    console.log("==================================================");
    console.log(`Current       --->  ${current}`);
    console.log(`Rollback to   --->  ${previous}`);
    console.log("==================================================");
    let choice = await question("Current will be deleted, continue? Y/N\n");

    if (choice.toUpperCase() !== "Y") {
      console.log("Rollback canceled.");
    } else {
      // 重置软连接
      await exec(`rm -f ${REMOTE_SRC_DIR}`);
      await exec(`ln -s ${REMOTE_BASE_DIR}/${previous} ${REMOTE_SRC_DIR}`);
      // 删除当前版本对应目录
      await exec(`rm -rf ${REMOTE_BASE_DIR}/${current}`);

      console.log("Succeed in rollback");
    }
  });
})();