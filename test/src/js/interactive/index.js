import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

if (document.body) {
  const div = document.getElementById('root');
  if (div.hasChildNodes()) {
    ReactDOM.hydrate(<App />, div);
  } else {
    ReactDOM.render(<App />, div);
  }
}

export default () => ReactDOMServer.renderToString(<App />);
