const path = require("path");
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        syspass: "./syspass.js",
        background: "./background.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].js'
    },
    watchOptions: {
        ignored: ['dist', 'node_modules']
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: 'addon', to: './'},
            {from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js', to: './browser-polyfill.js'}
        ]),
    ]
};
