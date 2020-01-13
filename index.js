const HtmlWebpackPlugin = require('html-webpack-plugin');
const _eval = require('eval');
const cheerio = require('cheerio');
const chalk = require('chalk');
const validateOptions = require('schema-utils');
const optionsSchema = require('./schema');
const createElement = require('create-html-element');
const jsesc = require('jsesc');

// Inspired by...
// https://github.com/markdalgleish/static-site-generator-webpack-plugin/blob/master/index.js

const pluginLabel = chalk.red('ReactStaticRendererPlugin:');

class ReactStaticRendererPlugin {
  constructor(options = {}) {
    validateOptions(optionsSchema, options, 'ReactStaticRendererPlugin');
    this.options = this.areShallowOptions(options) ?
      { 'index.html': options } : options;
  }

  areShallowOptions(options) {
    const testKey = Object.keys(options)[0];
    return typeof options[testKey] === 'string';
  }

  findAsset(entry, compilation) {
    const webpackStats = compilation.getStats();
    const webpackStatsJson = webpackStats.toJson();

    let outputFile = webpackStatsJson.assetsByChunkName[entry];

    if (!outputFile) return null;

    // Webpack outputs an array for each chunk when using sourcemaps
    if (outputFile instanceof Array) {
    // Is the main bundle always the first element?
      outputFile = outputFile.find(function(filename) {
        return /\.js$/.test(filename);
      });
    }
    if (!/\.js$/.test(outputFile)) return null;
    return compilation.assets[outputFile];
  };

  generateScriptForProps(props, injectPropsTo) {
    return createElement({
      name: 'script',
      attributes: {
        type: 'application/javascript',
      },
      html: `window.${injectPropsTo} = ${jsesc(props, { isScriptContext: true })};`,
    });
  }

  injectReactApp(entry, context, html, compilation) {
    const { selector, scope, props, injectPropsTo } = context;

    const asset = this.findAsset(entry, compilation);

    if (!asset) return html;

    const source = asset.source();
    let app;
    let renderedString;

    try {
      app = _eval(source, { window: {}, document: {}, ...scope });
    } catch (e) {
      throw new Error(`${pluginLabel} Error evaluating component asset.\n${e}`);
    }

    try {
      renderedString = app.default(props);
    } catch (e) {
      throw new Error(`${pluginLabel} Error rendering component.\n${e}`);
    }

    const $ = cheerio.load(html);

    if ($(selector).length < 1) {
      throw new Error(`${pluginLabel} Can't find element with query selector: '${selector}'.`);
    }

    if ($(selector).length > 1) {
      console.warn(`${pluginLabel} More than one element with query selector: '${selector}'.`);
    }

    $(selector).html('');
    $(selector).append(renderedString);

    if (injectPropsTo) {
      $('body').prepend(this.generateScriptForProps(props, injectPropsTo));
    }
    return $.html();
  }

  getContext(option) {
    if (typeof option === 'string') {
      return {
        selector: option,
        scope: {},
        props: {},
        injectPropsTo: false,
      };
    } else {
      return {
        selector: option.selector,
        scope: option.scope || {},
        props: option.props || {},
        injectPropsTo: option.injectPropsTo || false,
      };
    }
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('ReactStaticRendererPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'ReactStaticRendererPlugin',
        (data, cb) => {
          const outputName = data.plugin.childCompilationOutputName;

          if (!(outputName in this.options)) cb(null, data);

          const entryMap = this.options[outputName];

          let html = data.html;

          Object.keys(entryMap).forEach((entry) => {
            const context = this.getContext(entryMap[entry]);
            html = this.injectReactApp(entry, context, html, compilation);
          });

          data.html = html;

          cb(null, data);
        }
      );
    });
  }
}

module.exports = ReactStaticRendererPlugin;
