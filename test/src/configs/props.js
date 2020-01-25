const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Plugin = require('../../../dist/index.js');

const merge = require('webpack-merge');
const commonConfig = require('./common');

module.exports = merge([
  commonConfig, {
    entry: {
      app: [
        '@babel/polyfill',
        path.resolve(__dirname, '../js/props/index.js'),
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'templates/index.html'),
        excludeChunks: ['app'],
      }),
      new Plugin({
        'index.html': {
          app: {
            selector: '#root',
            props: {
              title: 'My title',
            },
          },
        },
      }),
    ],
  }]);
