'use strict';
const path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        main: './src/Main.ts',
        background: './src/Background.ts'
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/dist"
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
            { from: 'manifest.json'},
            { from: 'icons', to: 'icons' },
            { from: 'LICENSE'}
            ],
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: 'pre',
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
        alias: {
            "webextension-polyfill-ts": path.resolve(path.join(__dirname, "node_modules", "webextension-polyfill-ts"))
        },
    }
};
