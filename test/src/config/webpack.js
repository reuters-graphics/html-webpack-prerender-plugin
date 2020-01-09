const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Plugin = require('../../..');

module.exports = {
  entry: path.resolve(__dirname, '../js/index.js'),
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: 'bundle.js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              targets: {
                node: true,
                // browsers: 'last 2 versions',
              },
            }],
            '@babel/preset-react',
          ],
          plugins: [
            '@babel/proposal-class-properties',
          ],
        },
      },
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
    new Plugin(),
  ],
};
