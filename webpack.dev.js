const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'development',
  // 选择适合的 source map 类型：
  devtool: 'eval-source-map', // 开发环境推荐：高质量，重编译速度快
  // devtool: 'source-map',      // 生产环境推荐：独立 .map 文件
  // devtool: 'eval-cheap-module-source-map', // 编译更快，但列信息不精确
  // devtool: 'inline-source-map', // 将 source map 内联在 bundle 中
  entry: './src/main.ts',
  module: {
    rules: [{
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: false, // 加快编译速度，类型检查交给其他工具
            configFile: 'tsconfig.json'
          }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.tsx$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: false, // 加快编译速度，类型检查交给其他工具
            configFile: 'tsconfig.json'
          }
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src') // 路径别名，方便调试时定位
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    library: {
      type: 'module', // 如果是要作为库使用
    },
  },

  experiments: {
    outputModule: true, // 启用 ES 模块输出
  },

  // 优化配置
  optimization: {
    minimize: false, // 开发环境不压缩，便于调试
    usedExports: true, // 标记未使用的导出
  },

  // 缓存配置，加快重建速度
  cache: {
    type: 'filesystem',
  },
};