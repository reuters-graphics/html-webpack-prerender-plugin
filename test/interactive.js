const expect = require('expect.js');
const MemoryFS = require('memory-fs');
const webpackConfig = require('./src/configs/interactive');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fileReader = require('./utils/readFile');
const compileAssets = require('./utils/compileAssets');
const startServer = require('./utils/startServer');

describe('Test an interactive React app', function() {
  this.timeout(10000);

  const fs = new MemoryFS();

  before(async function() {
    await compileAssets(webpackConfig, fs);
  });

  it('Should render and inject markup', async function() {
    const readFile = fileReader(fs);
    const $ = cheerio.load(readFile('index.html'));

    expect($('h1').text()).to.be('React app');
    expect($('button').text()).to.be('Clicked 0 times');
  });

  it('Should hydrate and be interactive', async function() {
    const { server, port } = await startServer(fs);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}`);
    const button = await page.$('button');
    await button.click();
    await button.click();
    const text = await page.evaluate(element => element.textContent, button);

    expect(text).to.be('Clicked 2 times');

    await browser.close();
    server.close();
  });
});
