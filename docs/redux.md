![](../badge.svg)

# React/Redux app with preloaded state

`webpack.config.js`

```javascript
module.exports = {
  entry: './js/index.js',
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
    new Plugin({
      main: {
        selector: '#root',
        props: { title: 'Hello world!' },
        injectPropsTo: '__PRELOADED_STATE__',
      }
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

`js/index.js`

```javascript
import App from './SomeApp';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { createStore } from 'redux';
import reducer from './reducer';

if (document.body) {
  const store = createStore(reducer, window.__PRELOADED_STATE__);

  const div = document.getElementById('root');
  if (div.hasChildNodes()) {
    ReactDOM.hydrate(
      <Provider store={store}>
        <App />
      </Provider>, div);
  } else {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>, div);
  }
}

export default (props) => {
  const store = createStore(reducer, props);
  return ReactDOMServer.renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  );
};
```
