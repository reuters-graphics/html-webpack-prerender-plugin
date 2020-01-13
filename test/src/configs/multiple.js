const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Plugin = require('../../..');

const merge = require('webpack-merge');
const commonConfig = require('./common');

module.exports = merge([
  commonConfig, {
    entry: {
      app1: path.resolve(__dirname, '../js/multiple/app1.js'),
      app2: path.resolve(__dirname, '../js/multiple/app2.js'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'templates/multiple.html'),
      }),
      new Plugin({
        app1: '#root-1',
        app2: '#root-2',
      }),
    ],
  }]);
