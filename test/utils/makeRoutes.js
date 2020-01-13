const path = require('path');
const fileReader = require('./readFile');

const DIST = path.resolve(__dirname, '../dist');

module.exports = (app, fs) => {
  const readFile = fileReader(fs);
  fs.readdirSync(DIST).forEach((file) => {
    if (file === 'index.html') {
      app.get('/', (req, res) => res.send(readFile(file)));
    } else {
      app.get(`/${file}`, (req, res) => res.send(readFile(file)));
    }
  });
};
