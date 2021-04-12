const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                include: [path.resolve(__dirname, 'src')],
                use: [
                    {
                      loader: 'file-loader',
                      options: {
                          name: './statics/[contenthash].[ext]'
                      }
                    }
                ]
            },
            {
                test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/, 
                loader: 'file-loader',
                options: {
                    name: './statics/[contenthash].[ext]'
                }
            }
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: './index.html',
        }),
    ],
};