// 实现命令行交互的工具类
// 涉及 Node.js 自带的 readline 模块，参考：https://nodejs.org/api/readline.html

const os = require('os');
const readline = require('readline');

// 命令行交互方法，展示问题，并返回用户输入内容
const question = (content, option = { hide: false}) => {
  return new Promise(resolve => {
    const rn = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rn._writeToOutput = function _writeToOutput(stringToWrite) {
      if (rn.stdoutMuted && stringToWrite !== os.EOL) {
        rn.output.write("*");
      } else {
        rn.output.write(stringToWrite);
      }
    };

    rn.question(content, answer => {
      resolve(answer);
      rn.close();
    });

    rn.stdoutMuted = option.hide;
  });
};

module.exports = { question };