const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Plugin = require('../../..');

const merge = require('webpack-merge');
const commonConfig = require('./common');

module.exports = merge([
  commonConfig, {
    mode: 'production',
    entry: [
      'regenerator-runtime/runtime',
      path.resolve(__dirname, '../js/async/index.js'),
    ],
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'templates/index.html'),
      }),
      new Plugin({
        main: {
          selector: '#root',
          scope: { setTimeout },
        },
      }),
    ],
  }]);
