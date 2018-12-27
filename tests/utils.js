const path = require('path').posix;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RewriteCssPublicPathWebpackPlugin = require('../lib/index');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PROJECT_ROOT = path.resolve(__dirname, './project');

function getWebpackConfig (options) {
    const webpackConfig = {
        mode: 'production',
        context: PROJECT_ROOT,
        entry: options.entry,
        output: {
            path: options.outputPath,
            publicPath: options.publicPath,
            filename: '[name].js',
            chunkFilename: '[name].js'
        },
        optimization: {
            minimize: false
        },
        module: {
            rules: [
                {
                    test: /(.css)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader'
                    ]
                },
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env'],
                                plugins: ["@babel/plugin-syntax-dynamic-import"]
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(options.outputPath),
            new MiniCssExtractPlugin(),
            new HtmlWebpackPlugin(),
            new RewriteCssPublicPathWebpackPlugin({
                publicPath: options.cssPublicPath
            })
        ]
    };

    if (options.emitSingleRuntime) {
        webpackConfig.optimization.runtimeChunk = 'single';
    }
    return webpackConfig;
}

function getOutputPath(dir) {
    return path.resolve(PROJECT_ROOT, './dist', dir);
}

module.exports = {
    getOutputPath,
    getWebpackConfig
};
