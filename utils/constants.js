// 前后端工程自动化部署涉及的服务器路径常量

const REMOTE_BASE_DIR = '/srv/xw-web';
const SERVER_TGZ_FILE_NAME = 'dist-xw-server.tgz';
const CLIENT_TGZ_FILE_NAME = 'dist-xw-client.tgz';

const config = {
  server: {
    TGZ_FILE_NAME: SERVER_TGZ_FILE_NAME,
    REMOTE_DIST_FILE: `/tmp/${SERVER_TGZ_FILE_NAME}`,
    REMOTE_BASE_DIR: REMOTE_BASE_DIR,
    REMOTE_SRC_DIR: `${REMOTE_BASE_DIR}/xw-server`
  },
  client: {
    TGZ_FILE_NAME: CLIENT_TGZ_FILE_NAME,
    REMOTE_DIST_FILE: `/tmp/${CLIENT_TGZ_FILE_NAME}`,
    REMOTE_BASE_DIR: REMOTE_BASE_DIR,
    REMOTE_SRC_DIR: `${REMOTE_BASE_DIR}/xw-client`
  }
};

module.exports = config;