import App from './App';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

export default (props) => ReactDOMServer.renderToStaticMarkup(<App {...props} />);
