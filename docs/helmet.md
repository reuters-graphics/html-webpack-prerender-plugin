![](../badge.svg)

# Usage with react-helmet-async


`webpack.config.js`

```javascript
// Add this polyfill to scope so react-helmet-async has access
// to global requestAnimationFrame
const requestAnimationFrame = require('raf');

module.exports = {
  entry: [
    '@babel/polyfill',
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
    new Plugin({
      main: {
        selector: '#root',
        scope: { requestAnimationFrame },
      },
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
    <div id="root"></div>
  </body>
</html>
```

`js/app.js`

```javascript
import { Helmet, HelmetProvider } from 'react-helmet-async';

import React from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';

const helmetContext = {};

const App = () => (
  <HelmetProvider context={helmetContext}>
    <Helmet>
      <title>Hello world page</title>
    </Helmet>
    <h1>Hello world!</h1>
  </HelmetProvider>
);

if (document.body) {
  const div = document.getElementById('root');
  ReactDOM.hydrate(<App />, div);
}

export default () => {
  // This testing flag tells react-helmet-async to use
  // server config when document is present in UMD bundle.
  HelmetProvider.canUseDOM = false;

  const html = renderToString(<App />);

  const { helmet } = helmetContext;

  // If you return an array instead of a string, the plugin
  // assumes the first item in the array is the rendered
  // markup and appends the second to the head of the page.
  return [html, helmet.title.toString()];
};
```
