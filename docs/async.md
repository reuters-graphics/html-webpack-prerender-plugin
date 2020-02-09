![](../badge.svg)

# Async rendering


`webpack.config.js`

```javascript
module.exports = {
  entry: [
    'regenerator-runtime/runtime', // Async support!
    './js/app.js',
  ],
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
    new Plugin({ main: '#root' }),
  ],
};
```

`templates/index.html`

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head></head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

`js/app.js`

```javascript
export default async() => {
  const response = await fetch('https://api.com');
  const data = await response.json();

  const list = data.map(datum => `<li>${datum}</li>`).join('');

  return `<ul>${list}</ul>`;
};
```
