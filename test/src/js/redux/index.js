import { hydrate, render } from 'react-dom';

import App from './App';
import { Provider } from 'react-redux';
import React from 'react';
import { createStore } from 'redux';
import reducer from './reducer';
import { renderToString } from 'react-dom/server';

if (document.body) {
  const store = createStore(reducer, window.__PRELOADED_STATE__);

  const div = document.getElementById('root');
  if (div.hasChildNodes()) {
    hydrate(
      <Provider store={store}>
        <App />
      </Provider>, div);
  } else {
    render(
      <Provider store={store}>
        <App />
      </Provider>, div);
  }
}

export default (props) => {
  const store = createStore(reducer, props);
  return renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  );
};
