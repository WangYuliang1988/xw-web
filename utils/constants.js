// 前后端工程自动化部署涉及的服务器路径常量

const REMOTE_BASE_DIR = '/srv/xw-web';
const SERVER_TGZ_FILE_NAME = 'dist-xw-server.tgz';

const CLIENT_V2_TGZ_FILE_NAME = "dist-xw-client-v2.tgz";
const CLIENT_V3_TGZ_FILE_NAME = "dist-xw-client-v3.tgz";

const config = {
  server: {
    TGZ_FILE_NAME: SERVER_TGZ_FILE_NAME,
    REMOTE_DIST_FILE: `/tmp/${SERVER_TGZ_FILE_NAME}`,
    REMOTE_BASE_DIR: REMOTE_BASE_DIR,
    REMOTE_SRC_DIR: `${REMOTE_BASE_DIR}/xw-server`,
  },
  clientv2: {
    TGZ_FILE_NAME: CLIENT_V2_TGZ_FILE_NAME,
    REMOTE_DIST_FILE: `/tmp/${CLIENT_V2_TGZ_FILE_NAME}`,
    REMOTE_BASE_DIR: REMOTE_BASE_DIR,
    REMOTE_SRC_DIR: `${REMOTE_BASE_DIR}/xw-client-v2`,
  },
  clientv3: {
    TGZ_FILE_NAME: CLIENT_V3_TGZ_FILE_NAME,
    REMOTE_DIST_FILE: `/tmp/${CLIENT_V3_TGZ_FILE_NAME}`,
    REMOTE_BASE_DIR: REMOTE_BASE_DIR,
    REMOTE_SRC_DIR: `${REMOTE_BASE_DIR}/xw-client-v3`,
  },
};

module.exports = config;