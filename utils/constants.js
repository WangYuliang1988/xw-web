// 后端工程 xw-server 自动化部署涉及的服务器路径常量

const TGZ_FILE_NAME = 'dist-xw-server.tgz';
const REMOTE_DIST_FILE = `/tmp/${TGZ_FILE_NAME}`;

const REMOTE_BASE_DIR = '/srv/xw-web';
const REMOTE_SRC_DIR = `${REMOTE_BASE_DIR}/xw-server`;


module.exports = { TGZ_FILE_NAME, REMOTE_DIST_FILE, REMOTE_BASE_DIR, REMOTE_SRC_DIR }