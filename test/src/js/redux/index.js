import App from './App';
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
