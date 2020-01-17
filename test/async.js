const expect = require('expect.js');
const MemoryFS = require('memory-fs');
const webpackConfig = require('./src/configs/async');
const cheerio = require('cheerio');
const fileReader = require('./utils/readFile');
const compileAssets = require('./utils/compileAssets');
const startServer = require('./utils/startServer');
const puppeteer = require('puppeteer');

describe('Test an async React app', function() {
  this.timeout(10000);

  const fs = new MemoryFS();

  before(async function() {
    await compileAssets(webpackConfig, fs);
  });

  it('Should render and inject static markup', async function() {
    const readFile = fileReader(fs);
    const $ = cheerio.load(readFile('index.html'));

    expect($('li').length).to.be(3);
    expect($('li').first().text()).to.be('apple');
    expect($('li').last().text()).to.be('cherry');
  });

  it('Should hydrate', async function() {
    const { server, port } = await startServer(fs);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}`);
    const listItem = await page.$$('li');
    const item1text = await page.evaluate(element => element.textContent, listItem[0]);

    expect(item1text).to.be('pear');

    const item2text = await page.evaluate(element => element.textContent, listItem[1]);

    expect(item2text).to.be('quince');

    await browser.close();
    server.close();
  });
});
