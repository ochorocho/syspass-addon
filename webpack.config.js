const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        "syspass": "./javascript/syspass.js",
        "background": "./javascript/background.js",
        "options": "./javascript/options.js",
        "popup": "./javascript/popup.js",
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
            {from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js', to: './polyfill.js'}
        ]),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false
            })
        ],
    },
    module: {
        rules: [
            {
                test: /.scss$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].css',
                            outputPath: './'
                        }
                    },
                    { loader: 'extract-loader' },
                    { loader: 'css-loader' },
                    { loader: 'postcss-loader' },
                    { loader: 'sass-loader' }
                ]
            }
        ]
    },
};
