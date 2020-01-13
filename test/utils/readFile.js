const path = require('path');

const DIST = path.resolve(__dirname, '../dist');

module.exports = (fs) => (file) => fs.readFileSync(path.resolve(DIST, file), 'utf-8');
