module.exports = {
    mode: 'production', // production or development
    target: 'node',
    devtool: 'source-map', // if needed
    // for TypeScript
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    }
                },
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts'],
    }
}