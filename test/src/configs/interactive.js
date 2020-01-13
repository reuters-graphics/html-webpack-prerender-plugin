const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Plugin = require('../../..');

const merge = require('webpack-merge');
const commonConfig = require('./common');

module.exports = merge([
  commonConfig, {
    devtool: 'source-map',
    entry: path.resolve(__dirname, '../js/interactive/index.js'),
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'templates/index.html'),
      }),
      new Plugin({ main: '#root' }),
    ],
  }]);
