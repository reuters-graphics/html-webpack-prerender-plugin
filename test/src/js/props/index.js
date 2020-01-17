import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const App = ({ title }) => (
  <h1>{title}</h1>
);

export default (props) => renderToStaticMarkup(<App {...props} />);
