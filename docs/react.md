![](../badge.svg)

# React app

`webpack.config.js`

```javascript
module.exports = {
  entry: './js/app.js',
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
      options: {
        presets: [ '@babel/preset-react' ],
      },
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
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

const App = () => (
  <h1>Hello world!</h1>
);

if (document.body) {
  const div = document.getElementById('root');
  if (div.hasChildNodes()) {
    ReactDOM.hydrate(<App />, div);
  } else {
    ReactDOM.render(<App />, div);
  }
}

export default () => ReactDOMServer.renderToString(<App />);
```
