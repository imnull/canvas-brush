const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const PxToViewport = require('postcss-px-to-viewport')

module.exports = options => {
    const { WEBPACK_SERVE } = options
    return {
        mode: WEBPACK_SERVE ? 'development' : 'production',
        entry: './src/index',
        // 输出配置
        output: {
            path: path.resolve('dist'),
            // filename: 'main.js',
            // publicPath: '/static/'
        },
        // 模块规则
        module: {
            rules: [
                {
                    test: /\.[jt]sx?$/,
                    exclude: /node_modules/,
                    loader: 'esbuild-loader',
                    options: {
                        loader: 'tsx',
                        target: 'esnext'
                    }
                },
                {
                    test: /\.(css|s[ac]ss)$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        PxToViewport({
                                            viewportWidth: 750, // 设计稿宽度
                                            unitPrecision: 5,   // 转换精度
                                            viewportUnit: 'vw', // 转换后的单位
                                            selectorBlackList: ['.ignore', '.hairlines'], // 忽略转换的类
                                            minPixelValue: 1,   // 小于等于1px的值不转换
                                            mediaQuery: false,   // 不转换媒体查询中的px
                                            unitToConvert: 'rpx',
                                        })
                                    ]
                                }
                            }
                        },
                        'sass-loader']
                },
            ]
        },

        // 插件配置
        plugins: [
            new HtmlWebpackPlugin({
                template: './template.html',
                filename: `index.html`,
                hash: true,
                title: 'Avatar Cropper Demo',
            }),
            new CleanWebpackPlugin(),
            // new CopyWebpackPlugin({
            //     patterns: [
            //         { from: 'static' }
            //     ]
            // })
        ],

        // 解析选项
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
            // alias: {
            //     '~': path.resolve('./src'),
            //     '@images': path.resolve('./src/images'),
            // }
        },
        devServer: {
            port: 3700,
            hot: true,
            allowedHosts: 'all',
            // static: path.resolve('static'),
        },
    };

}