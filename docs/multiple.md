![](../badge.svg)

# Multiple apps

`webpack.config.js`

```javascript
module.exports = {
  entry: {
    app: './js/app/index.js',
    header: './js/header/index.js',
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
    }),
    new Plugin({
      app: '#app-root',
      header: '#header-root',
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
    <div id='header-root'></div>
    <div id="app-root"></div>
  </body>
</html>
```

`js/app/index.js`

```javascript
export default () => '<h1>Hello world!</h1>';
```

`js/header/index.js`

```javascript
export default () => `<nav>
  <a href="/">Home</a>
  <a href="/about/">About</a>
</nav>`;
```
