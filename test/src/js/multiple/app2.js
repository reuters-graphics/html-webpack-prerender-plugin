import { hydrate, render } from 'react-dom';

import React from 'react';
import { renderToString } from 'react-dom/server';

const App = () => (
  <h2>Second app</h2>
);

const div = document.getElementById('root-2');
if (div.hasChildNodes()) {
  hydrate(<App />, div);
} else {
  render(<App />, div);
}

export default (props) => renderToString(<App />);
