const HtmlWebpackPlugin = require('html-webpack-plugin');
const _eval = require('eval');
const cheerio = require('cheerio');
const chalk = require('chalk');
const validateOptions = require('schema-utils');
const optionsSchema = require('./schema');
const createElement = require('create-html-element');
const jsesc = require('jsesc');

const pluginName = 'HtmlWebpackSsrPlugin';
const errorLabel = `${pluginName} ${chalk.red('ERROR:')}`;
const warnLabel = `${pluginName} ${chalk.yellow('Warning:')}`;

class HtmlWebpackSsrPlugin {
  constructor(options = {}) {
    validateOptions(optionsSchema, options, pluginName);
    this.options = this.areShallowOptions(options) ?
      { 'index.html': options } : options;
  }

  areShallowOptions(options) {
    const testKey = Object.keys(options)[0];
    return typeof options[testKey] === 'string' || options[testKey].selector;
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

  async injectReactApp(entry, context, html, compilation) {
    const { selector, scope, props, injectPropsTo } = context;

    const asset = this.findAsset(entry, compilation);

    if (!asset) return html;

    const source = asset.source();
    let app, rendered, markup, head;

    try {
      app = _eval(source, { window: {}, document: {}, ...scope }, true);
    } catch (e) {
      throw new Error(`${errorLabel} Error evaluating asset source.\n${e}`);
    }

    try {
      rendered = await app.default(props);
    } catch (e) {
      throw new Error(`${errorLabel} Error rendering component.\n${e}`);
    }

    if (Array.isArray(rendered)) {
      markup = rendered[0];
      head = rendered[1];
    } else {
      markup = rendered;
    }

    const $ = cheerio.load(html);

    if ($(selector).length < 1) {
      throw new Error(`${errorLabel} Can't find element with query selector: '${selector}'.`);
    }

    if ($(selector).length > 1) {
      console.warn(`${warnLabel} More than one element with query selector: '${selector}'.`);
    }

    $(selector).html(''); // Blow away any markup in container
    $(selector).append(markup);

    if (head) $(selector).append(head);

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
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        pluginName,
        async(data, cb) => {
          const outputName = data.plugin.childCompilationOutputName;

          if (!(outputName in this.options)) cb(null, data);

          const entryMap = this.options[outputName];

          let html = data.html;
          for (const entry in entryMap) {
            const context = this.getContext(entryMap[entry]);

            try {
              html = await this.injectReactApp(entry, context, html, compilation);
            } catch (e) {
              cb(e, data);
            }
          };

          data.html = html;

          cb(null, data);
        }
      );
    });
  }
}

module.exports = HtmlWebpackSsrPlugin;
