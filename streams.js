const express = require('express');
const { parse } = require('url');
const puppeteer = require('puppeteer');
const { from, defer, forkJoin } = require('rxjs');
const { mergeMap, catchError } = require('rxjs/operators');

(async () => {
  const app = express();
  const port = 3800;

  app.get('/I/want/title', async (req, res) => {
    try {
      const { query } = parse(req.url, true);
      const addresses = Array.isArray(query.address) ? query.address : [query.address];

      const browser = await puppeteer.launch();
      const pages = await Promise.all(addresses.map(() => browser.newPage()));

      const titleObservables = addresses.map((address, index) => {
        return defer(async () => {
          try {
            const normalizedAddress = address.startsWith('http://') || address.startsWith('https://')
              ? address
              : `http://${address}`;

            await pages[index].goto(normalizedAddress);
            const title = await pages[index].title();
            return { address, title };
          } catch (error) {
            return { address, title: 'NO RESPONSE' };
          }
        });
      });

      const titles = await forkJoin(titleObservables).toPromise();

      await browser.close();

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<html><head></head><body><h1>Following are the titles of given websites:</h1><ul>');
      titles.forEach(({ address, title }) => {
        res.write(`<li>${address} - "${title}"</li>`);
      });
      res.write('</ul></body></html>');
      res.end();
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
})().catch(error => {
  console.error('Failed to start server:', error);
});
