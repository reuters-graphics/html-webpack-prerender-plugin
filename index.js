const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactDOMServer = require('react-dom/server');
const _eval = require('eval');
const cheerio = require('cheerio');
const chalk = require('chalk');

// Referencing...
//  https://github.com/markdalgleish/static-site-generator-webpack-plugin/blob/master/index.js

class ReactStaticRendererPlugin {
  constructor(options) {
    this.options = options;
  }

  findAsset(src, compilation, webpackStatsJson) {
    if (!src) {
      var chunkNames = Object.keys(webpackStatsJson.assetsByChunkName);

      src = chunkNames[0];
    }

    const asset = compilation.assets[src];

    if (asset) {
      return asset;
    }

    let chunkValue = webpackStatsJson.assetsByChunkName[src];

    if (!chunkValue) return null;

    // Webpack outputs an array for each chunk when using sourcemaps
    if (chunkValue instanceof Array) {
    // Is the main bundle always the first element?
      chunkValue = chunkValue.find(function(filename) {
        return /\.js$/.test(filename);
      });
    }
    if (!/\.js$/.test(chunkValue)) return null;
    return compilation.assets[chunkValue];
  };

  apply(compiler) {
    compiler.hooks.compilation.tap('ReactStaticRendererPlugin', (compilation) => {
      compilation.hooks.optimizeAssets.tapAsync('static-site-generator-webpack-plugin', (_, cb) => {
        const webpackStats = compilation.getStats();
        const webpackStatsJson = webpackStats.toJson();

        const asset = this.findAsset(null, compilation, webpackStatsJson);

        if (!asset) {
          cb(null, compilation);
          return;
        }

        const source = asset.source();
        let app;

        try {
          app = _eval(source, { window: {}, document: {} });
        } catch (e) {
          console.error(`${chalk.red('ReactStaticRendererPlugin:')} Error evaluating component asset.`);
          cb(e, compilation);
          return;
        }

        try {
          this.injection = ReactDOMServer.renderToString(app.default());
        } catch (e) {
          console.error(`${chalk.red('ReactStaticRendererPlugin:')} Error rendering component.`);
          cb(e, compilation);
          return;
        }

        if (!app.selector) {
          console.error(`${chalk.red('ReactStaticRendererPlugin:')} Component module should export 'selector'.`);
          cb(new Error('Component module does not export \'selector\'.'), compilation);
          return;
        }

        this.selector = app.selector;

        cb(null, compilation);
      });

      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'ReactStaticRendererPlugin',
        (data, cb) => {
          const $ = cheerio.load(data.html);
          $(this.selector).append(this.injection);
          data.html = $.html();
          cb(null, data);
        }
      );
    });
  }
}

module.exports = ReactStaticRendererPlugin;
