const webpack = require('webpack');

module.exports = async(webpackConfig, fs) => {
  const compiler = webpack(webpackConfig);

  compiler.outputFileSystem = fs;

  await new Promise((resolve, reject) => compiler.run((err, stats) => {
    if (err) reject(new Error(err));
    if (stats.hasErrors()) {
      console.error(stats.toJson().errors);
      reject(new Error('Compilation failed.', stats.toJson().errors));
    }
    resolve();
  }));
};
