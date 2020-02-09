const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Plugin = require('../../../dist/index.js');

const merge = require('webpack-merge');
const commonConfig = require('./common');

module.exports = merge([
  commonConfig, {
    entry: [
      '@babel/polyfill',
      path.resolve(__dirname, '../js/head/index.js'),
    ],
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'templates/index.html'),
      }),
      new Plugin({ main: '#root' }),
    ],
  }]);
