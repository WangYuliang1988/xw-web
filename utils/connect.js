// 同服务器建立 SSH 连接并进行交互的工具类
// 涉及 ssh2 库，参考：https://www.npmjs.com/package/ssh2

const { Client } = require('ssh2');
const { question } = require('./question');

const conn = new Client();

// 执行服务器上的 Linux 命令
const exec = (cmd) => {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) reject(err);

      let rs = '';
      stream.on('data', (data) => {
        rs += data.toString();
      }).on('close', (code) => {
        if (code === 0) {
          resolve(rs);
        } else {
          reject(`Error: '${cmd}': ${rs}`);
        }
      }).stderr.on('data', (data) => {
        rs += data.toString();
      });
    });
  });
}

// 上传本地文件至服务器
const fastPut = (localPath, remotePath) => {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) reject(err);

      sftp.fastPut(localPath, remotePath, (err) => {
        if (err) reject(err);

        resolve(`Upload ${localPath} to ${remotePath}`);
      });
    });
  }); 
}

// 登录服务器，建立SSH连接
const login = async (todoAfterLogin) => {
  let host = await question('host:');
  let user = await question('user:');
  let password = await question('password:', { hide: true });

  conn.connect({
    host: host,
    port: 22,
    username: user,
    password: password
  }).on('ready', async () => {
    try {
      await todoAfterLogin();
    } catch (error) {
      console.log(error);
    } finally {
      conn.end();
    }
  }).on('error', (err) => {
    console.log(err);
  });
}

module.exports = { exec, fastPut, login }