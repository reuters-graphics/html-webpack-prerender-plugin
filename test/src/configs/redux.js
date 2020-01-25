const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Plugin = require('../../../dist/index.js');

const merge = require('webpack-merge');
const commonConfig = require('./common');

module.exports = merge([
  commonConfig, {
    entry: {
      reduxApp: path.resolve(__dirname, '../js/redux/index.js'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'page.html',
        template: path.resolve(__dirname, 'templates/index.html'),
      }),
      new Plugin({
        'page.html': {
          reduxApp: {
            selector: '#root',
            props: {
              list: [
                { name: 'milk', bought: true },
                { name: 'bread', bought: false },
                { name: 'chicken', bought: false },
              ],
            },
            injectPropsTo: '__PRELOADED_STATE__',
          },
        },
      }),
    ],
  }]);
