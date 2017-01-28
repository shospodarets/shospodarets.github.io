/**
 * Provides utils methods for Node.js
 */
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const path = require('path');

// VARS
const portalPath = path.resolve();

const nodeModulesCommonPath = `${portalPath}/common/node_modules`;
const nodeBinCommonPath = `${nodeModulesCommonPath}/.bin`;

const getPlatformBinExtension = (cmd) => {
    let platformBinExtension = '';
    if (process.platform === 'win32' && cmd !== 'node') {
        platformBinExtension = '.cmd';
    }

    return platformBinExtension;
};

/**
 * Methods
 */

/**
 *
 * @param {string}      cmd
 * @param {string[]}    args
 * @param {object}      [options]   process.spawn options
 * @param {function}    callback
 */
function runWithProgress(cmd, args, options, callback) {
    let errData;

    if (typeof options === 'function' && callback === undefined) {
        callback = options;
        options = undefined;
    }

    cmd += getPlatformBinExtension(cmd);

    cmd = spawn(cmd, args, options);

    cmd.stderr.setEncoding('utf8');

    cmd.stdout.setEncoding('utf8');
    cmd.stdout.on('data', (data) => {
        console.log(data.trim());
    });

    cmd.stderr.on('data', (data) => {
        errData += data;
        console.log(data);
    });

    cmd.on('close', (code) => {
        console.log('');
        callback(code, errData);
    });
}

/**
 * Executes a bin with the arguments
 * @param cmd {String}
 * @param args {String}
 * @param callback {Function}
 */
function runExec(cmd, args, callback) {
    exec(
        `${cmd}${getPlatformBinExtension(cmd)} ${args}`,
        (err, stdout, stderr) => {
            if (err) {
                console.log(stderr);
                callback(1, err);
            } else {
                if (stdout) {
                    console.log(stdout);
                }
                callback(0, stdout);
            }
        });
}

/**
 * Executes the command with the arguments
 * @param cmd {String}
 * @param args {String}
 * @param callback {Function}
 */
function runExecCommand(cmd, args, callback) {
    exec(
        `${cmd} ${args}`,
        (err, stdout/*, stderr*/) => {
            if (err) {
                callback(1, err);
            } else {
                callback(0, stdout);
            }
        });
}

/**
 * Run process from Npm Bin path
 */
function runNpmCommonBinWithProgress(cmd, args, options, callback) {
    return runWithProgress(`${nodeBinCommonPath}/${cmd}`, args, options, callback);
}

/*--- EXPORTS ---*/
module.exports = {
    runWithProgress,
    runExec,
    runExecCommand,

    runNpmCommonBinWithProgress
};