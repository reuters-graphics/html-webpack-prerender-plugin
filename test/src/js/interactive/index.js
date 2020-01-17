import { hydrate, render } from 'react-dom';

import App from './App';
import React from 'react';
import { renderToString } from 'react-dom/server';

const div = document.getElementById('root');
if (div.hasChildNodes()) {
  hydrate(<App />, div);
} else {
  render(<App />, div);
}

export default (props) => renderToString(<App />);
