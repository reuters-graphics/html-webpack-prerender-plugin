import { hydrate, render } from 'react-dom';

import React from 'react';
import { renderToString } from 'react-dom/server';

const App = () => (
  <h1>First app</h1>
);

const div = document.getElementById('root-1');
if (div.hasChildNodes()) {
  hydrate(<App />, div);
} else {
  render(<App />, div);
}

export default (props) => renderToString(<App />);
