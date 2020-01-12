const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Plugin = require('../../..');

const merge = require('webpack-merge');
const commonConfig = require('./common');

module.exports = merge([
  commonConfig, {
    entry: path.resolve(__dirname, '../js/index.js'),
    // entry: {
    //   app: [
    //     '@babel/polyfill',
    //     path.resolve(__dirname, '../js/index.js'),
    //   ],
    //   anotherApp: [
    //   // '@babel/polyfill',
    //     path.resolve(__dirname, '../js/index.js'),
    //   ],
    // },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'templates/one.html'),
      }),
      new Plugin({
        main: '#root',
      }),
    ],
  }]);
