const path = require('path');

module.exports = {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: '[name].js',
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
                browsers: 'last 2 versions',
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
};
