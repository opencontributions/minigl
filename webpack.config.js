var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/demo.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'demo.min.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        })
    ]
};