import React from 'react';
import ReactDOMServer from 'react-dom/server';

const App = ({ title }) => (
  <h1>{title}</h1>
);

export default (props) => ReactDOMServer.renderToStaticMarkup(<App {...props} />);
