#!/usr/bin/env node

/**
 * Script takes the port as a param and tries to find and kill a process
 * which is listening the port
 *
 * Example of the script usage:
 * node SCRIPT %PORT_NUMBER%
 */

// REQUIRES
const nodeUtils = require('./node-utils');

// VARS
const port = process.argv[2]; // taking line argument
if (!port) {
    throw new Error('The script expects the port number sent via param');
}

// HELPERS
function killPyPort({
    getPIDByPortCommand,
    getKillCommandFromOutput
}) {
    // execute the find PID command
    return nodeUtils.runExecCommand(
        getPIDByPortCommand,
        '',
        (code, data) => {
            if (code !== 0) {
                console.error(`Couldn't find a process on the port: ${port}`, data);
                return;
            }

            if (!data) {
                console.log(`Couldn't find a process on the port: ${port}`);
                return;
            }

            // execute the kill command
            nodeUtils.runExecCommand(
                getKillCommandFromOutput(data),
                '',
                (_code, _data) => {
                    if (_code !== 0) {
                        console.error(`Couldn't kill a process on the port: ${port}`, _data);
                        return;
                    }

                    console.log(`Done for the port: ${port}`);
                }
            );
        }
    );
}

// INIT
if (process.platform === 'win32') { // WINDOWS
    // http://stackoverflow.com/a/35312370
    killPyPort({
        getPIDByPortCommand: `echo off & (for /f "tokens=5" %a in ('netstat -aon ^| findstr ${port}') do echo "%a") & echo on`,
        getKillCommandFromOutput: (output) => {
            const PID = output.split('\n')[0];// the first line only
            return `taskkill /F /PID ${PID}`;
        }
    });
} else { // NON WINDOWS
    // http://stackoverflow.com/a/16583477
    killPyPort({
        getPIDByPortCommand: `lsof -P | grep ':'${port} | awk '{print $2}'`,
        getKillCommandFromOutput: (output) => {
            //noinspection UnnecessaryLocalVariableJS
            const PID = output;// output is the PID actually
            return `kill -9 ${PID}`;
        }
    });
}