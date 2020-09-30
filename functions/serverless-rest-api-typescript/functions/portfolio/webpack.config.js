const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ZipPlugin = require("zip-webpack-plugin");

module.exports = {
    entry: './src/Lambda.ts',
    output: {
        filename: 'lambda.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'production', // production or development
    target: 'node',
    devtool: 'source-map', // if needed
    // for TypeScript
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    plugins: [
        new CleanWebpackPlugin(),
    ]
}