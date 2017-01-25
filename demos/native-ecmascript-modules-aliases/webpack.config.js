const path = require('path');
const webpack = require('webpack');
module.exports = {
    context: path.resolve(__dirname, './js'),
    entry: {
        app: './main-bundled.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
    },
};