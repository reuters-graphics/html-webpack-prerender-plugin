import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

const App = () => (
  <h2>Second app</h2>
);

if (document.body) {
  const div = document.getElementById('root-2');
  if (div.hasChildNodes()) {
    ReactDOM.hydrate(<App />, div);
  } else {
    ReactDOM.render(<App />, div);
  }
}

export default () => ReactDOMServer.renderToString(<App />);
