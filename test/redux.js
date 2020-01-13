const expect = require('expect.js');
const MemoryFS = require('memory-fs');
const webpackConfig = require('./src/configs/redux');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fileReader = require('./utils/readFile');
const compileAssets = require('./utils/compileAssets');
const startServer = require('./utils/startServer');

describe('Test an interactive React/Redux app', function() {
  this.timeout(10000);

  const fs = new MemoryFS();

  before(async function() {
    await compileAssets(webpackConfig, fs);
  });

  it('Should render and inject markup', async function() {
    const readFile = fileReader(fs);
    const $ = cheerio.load(readFile('page.html'));

    expect($('h1').text()).to.be('Shopping');
    expect($('li').first().text()).to.be('milk');
    expect($('li').last().text()).to.be('Buy chicken');
    expect($('body').find('script').first().html()).to.contain('__PRELOADED_STATE__');
  });

  it('Should hydrate and be interactive', async function() {
    const { server, port } = await startServer(fs);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`http://localhost:${port}/page.html`);

    const getItems = async() => {
      return page.evaluate(() => {
        const lis = Array.from(document.querySelectorAll('li'));
        return lis.map(li => li.textContent);
      });
    };

    let items = await getItems();

    expect(items[0]).to.be('milk');
    expect(items[1]).to.be('Buy bread');
    expect(items[2]).to.be('Buy chicken');

    const buyButton = await page.$('button#buy-bread');
    await buyButton.click();

    items = await getItems();

    expect(items[1]).to.be('bread');

    await page.type('input#item-input', 'teepee');
    const addButton = await page.$('button#add-item');
    await addButton.click();

    items = await getItems();

    expect(items[3]).to.be('Buy teepee');

    await browser.close();
    server.close();
  });
});
