const expect = require('expect.js');
const MemoryFS = require('memory-fs');
const webpackConfig = require('./src/configs/multiple');
const cheerio = require('cheerio');
const fileReader = require('./utils/readFile');
const compileAssets = require('./utils/compileAssets');

describe('Test multiple React apps', function() {
  this.timeout(10000);

  const fs = new MemoryFS();

  before(async function() {
    await compileAssets(webpackConfig, fs);
  });

  it('Should render and inject markup', async function() {
    const readFile = fileReader(fs);
    const $ = cheerio.load(readFile('index.html'));

    expect($('h1').text()).to.be('First app');
    expect($('h2').text()).to.be('Second app');
  });
});
