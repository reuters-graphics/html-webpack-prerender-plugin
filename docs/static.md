![](../badge.svg)

# Static markup

Use the `excludeChunks` option on `html-webpack-plugin` to render static markup (i.e., the app script is not included in the rendered page),

`webpack.config.js`

```javascript
module.exports = {
  entry: {
    staticApp: './js/index.js',
  },
  mode: 'production',
  output: {
    path: './dist',
    filename: '[name].js',
    libraryTarget: 'umd',
  },
  rules: [{
    test: /\.js$/,
    use: {
      loader: 'babel-loader',
    },
  }],
  plugins: [
    new HtmlWebpackPlugin({
      template: './templates/index.html',
      excludeChunks: ['staticApp']
    }),
    new Plugin({
      staticApp: '#root',
    }),
  ],
};
```

`templates/index.html`

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head></head>
  <body>
    <div id='root'></div>
  </body>
</html>
```

`js/index.js`

```javascript
export default () => '<h1>Hello world!</h1>';
```

### Rendered

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head></head>
  <body>
    <div id='root'>
      <h1>Hello world!</h1>
    </div>
  </body>
</html>
```
