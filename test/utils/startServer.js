const express = require('express');
const portfinder = require('portfinder');
const makeRoutes = require('./makeRoutes');

module.exports = async(fs) => {
  const app = express();

  makeRoutes(app, fs);

  let port;
  let server;

  await new Promise((resolve, reject) => {
    portfinder.getPortPromise()
      .then((p) => {
        port = p;
        server = app.listen(port, () => resolve());
      });
  });

  return { server, port };
};
