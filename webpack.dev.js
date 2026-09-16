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
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: false, // 加快编译速度，类型检查交给其他工具
            configFile: 'tsconfig.json'
          }
        },
        exclude: [
          '/node_modules/',
          '/src/wasm/',
          // 排除 wasmtk 生成的 bindings 文件，避免其内部类型报错
          '/\.bindings\.ts$/',
          // runner 可能也会引用到 bindings，一并排除
          '/\.runner\.ts$/'
        ],
        // exclude: '/node_modules/|/src/__tests__/|/src/wasm/',
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
        exclude: '/node_modules/',
      },
      {
        test: /\.wasm$/,
        type: 'asset/resource',
        generator: {
          // 输出到 wasm 目录，并保留原始文件名
          filename: '[name][ext]',
        },
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src') // 路径别名，方便调试时定位
    },
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'types')
    ],
    fallback: {
      fs: false,  // 告诉 webpack：不要尝试解析 'fs' 模块
      path: false,
    },
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