import Component from './Component';
import React from 'react';
import ReactDOM from 'react-dom';

if (document && document.body) {
  const div = document.getElementById('root');
  if (div.hasChildNodes()) {
    ReactDOM.hydrate(<Component />, div);
  } else {
    ReactDOM.render(<Component />, div);
  }
}

export const selector = '#root';

export default Component;