/**
 * Provides utils methods for Node.js
 */
const {spawn, exec} = require('child_process');
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
 * Spawns a subprocess to run a command.
 *
 * @param {string} cmd - The command to run
 * @param {string[]} args - The command arguments
 * @param {object} [options] - process.spawn options
 * @param {function} callback - The callback to be run upon completion
 * @returns {ChildProcess} - The reference to the child process.
 */
function runWithProgress(cmd, args, options, callback) {
    let errData;

    if (typeof options === 'function' && callback === undefined) {
        callback = options;
        options = undefined;
    }

    cmd += getPlatformBinExtension(cmd);

    cmd = spawn(cmd, args, options);

    // stderr and stdout may not be defined
    // depending on value of options.stdio
    if (cmd.stderr) {
        cmd.stderr.setEncoding('utf8');
        cmd.stderr.on('data', (data) => {
            errData += data;
            console.log(data);
        });
    }
    if (cmd.stdout) {
        cmd.stdout.setEncoding('utf8');
        cmd.stdout.on('data', (data) => {
            console.log(data.trim());
        });
    }

    cmd.on('close', (code) => {
        console.log('');
        callback(code, errData);
    });

    return cmd;
}

/**
 * Executes a bin with the arguments
 * @param {String} cmd
 * @param {String} args
 * @param {Function} callback
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
        }
    );
}

/**
 * Executes the command with the arguments
 * @param {String} cmd
 * @param {String} args
 * @param {Function} callback
 */
function runExecCommand(cmd, args, callback) {
    exec(
        `${cmd} ${args}`,
        (err, stdout/* , stderr*/) => {
            if (err) {
                callback(1, err);
            } else {
                callback(0, stdout);
            }
        }
    );
}

/**
 * Run process from Npm Bin path
 *
 * @param {String} cmd
 * @param {string[]} args
 * @param {Object} options
 * @param {Function} callback
 */
function runNpmCommonBinWithProgress(cmd, args, options, callback) {
    runWithProgress(`${nodeBinCommonPath}/${cmd}`, args, options, callback);
}

/* --- EXPORTS --- */
module.exports = {
    runWithProgress,
    runExec,
    runExecCommand,

    runNpmCommonBinWithProgress
};