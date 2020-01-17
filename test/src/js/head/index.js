import { Helmet, HelmetProvider } from 'react-helmet-async';

import React from 'react';
import { hydrate } from 'react-dom';
import { renderToString } from 'react-dom/server';

const helmetContext = {};

const App = () => (
  <HelmetProvider context={helmetContext}>
    <Helmet>
      <title>The title of this page</title>
      <link rel='canonical' href='https://github.com/reuters-graphics/' />
    </Helmet>
    <h1>A React app that injects head tags</h1>
  </HelmetProvider>
);

if (document.body) {
  const div = document.getElementById('root');
  hydrate(<App />, div);
}

export default () => {
  HelmetProvider.canUseDOM = false;
  const html = renderToString(<App />);
  const { helmet } = helmetContext;
  const head = [
    helmet.title.toString(),
    helmet.link.toString(),
  ].join('');
  return [html, head];
};
