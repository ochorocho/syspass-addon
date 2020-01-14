const path = require("path");
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        syspass: "./syspass.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "syspass.js"
    },
    watchOptions: {
        ignored: ['dist', 'node_modules']
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: 'addon', to: './'}
        ]),
    ]
};
