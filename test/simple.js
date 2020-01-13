const expect = require('expect.js');
const MemoryFS = require('memory-fs');
const webpackConfig = require('./src/configs/simple');
const cheerio = require('cheerio');
const fileReader = require('./utils/readFile');
const compileAssets = require('./utils/compileAssets');

describe('Test a simple app', function() {
  this.timeout(3000);

  const fs = new MemoryFS();

  before(async function() {
    await compileAssets(webpackConfig, fs);
  });

  it('Should render and inject static markup', async function() {
    const readFile = fileReader(fs);
    const $ = cheerio.load(readFile('index.html'));

    expect($('p').text()).to.be('Hello world!');
  });
});
