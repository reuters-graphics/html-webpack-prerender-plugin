const expect = require('expect.js');
const MemoryFS = require('memory-fs');
const webpackConfig = require('./src/configs/props');
const cheerio = require('cheerio');
const fileReader = require('./utils/readFile');
const compileAssets = require('./utils/compileAssets');

describe('Test a static React app passed some props', function() {
  this.timeout(10000);

  const fs = new MemoryFS();

  before(async function() {
    await compileAssets(webpackConfig, fs);
  });

  it('Should render and inject static markup', async function() {
    const readFile = fileReader(fs);
    const $ = cheerio.load(readFile('index.html'));

    expect($('h1').text()).to.be('My title');

    // Exclude the app to make a truly static app.
    expect($('script').length).to.be(0);
  });
});
