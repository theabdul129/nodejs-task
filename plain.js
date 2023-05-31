const http = require('http');
const url = require('url');
const puppeteer = require('puppeteer');

const server = http.createServer((req, res) => {
  const { query } = url.parse(req.url, true);
  const addresses = Array.isArray(query.address) ? query.address : [query.address];
  const titles = [];

  puppeteer.launch().then((browser) => {
    const pagePromises = addresses.map(() => browser.newPage());
    return Promise.all(pagePromises).then((pages) => {
      const pageFetchPromises = addresses.map((address, index) => {
        const normalizedAddress = address.startsWith('http://') || address.startsWith('https://')
          ? address
          : `http://${address}`;

        return pages[index].goto(normalizedAddress).then(() => pages[index].title());
      });

      return Promise.all(pageFetchPromises).then((fetchedTitles) => {
        titles.push(...addresses.map((address, index) => ({ address, title: fetchedTitles[index] })));
        return browser.close();
      });
    });
  }).then(() => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<html><head></head><body><h1>Following are the titles of given websites:</h1><ul>');
    titles.forEach(({ address, title }) => {
      res.write(`<li>${address} - "${title}"</li>`);
    });
    res.write('</ul></body></html>');
    res.end();
  }).catch((error) => {
    console.error(error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  });
});

const port = 3300;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
