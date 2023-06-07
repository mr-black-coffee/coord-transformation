const path = require('path');

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: './src/index.mjs',
    output: {
        path: path.resolve(__dirname, './dist/'),
        filename: 'index.js',
        library: 'coordTransformation',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    module: {
        rules: [
            {
                test: /\.jsx|.mjs|.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/transform-runtime'],
                    },
                },
            },
        ],
    },
    externals: {
        numeric: 'numeric',
    },
    mode: 'production',
};
