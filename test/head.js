const expect = require('expect.js');
const MemoryFS = require('memory-fs');
const webpackConfig = require('./src/configs/head');
const cheerio = require('cheerio');
const fileReader = require('./utils/readFile');
const compileAssets = require('./utils/compileAssets');

describe('Test a React helmet app', function() {
  this.timeout(10000);

  const fs = new MemoryFS();

  before(async function() {
    await compileAssets(webpackConfig, fs);
  });

  it('Should render and inject head tags', async function() {
    const readFile = fileReader(fs);
    const $ = cheerio.load(readFile('index.html'));

    expect($('h1').text()).to.be('A React app that injects head tags');
    expect($('title').text()).to.be('The title of this page');
    expect($('link[rel="canonical"]').attr('href')).to.be(
      'https://github.com/reuters-graphics/'
    );
  });
});
