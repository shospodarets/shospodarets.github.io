// Vars
const eslintBinPath = `./node_modules/.bin/eslint`;
const platformBinExtension = process.platform === 'win32' ? '.cmd' : '';

// Config data
const eslintConfig = JSON.parse(require('fs').readFileSync('./.eslintrc', 'utf8'));
const filesToTest = eslintConfig.filesToTest;

// RUN
function runExec(cmd, args) {
    require('child_process').exec(
        `${cmd}${platformBinExtension} ${args} --quiet`,
        (err, stdout) => {
            if (stdout) {
                console.error(stdout);
                process.exit(1);// failure error code
            }
        });
}

runExec(eslintBinPath, filesToTest.join(' '));