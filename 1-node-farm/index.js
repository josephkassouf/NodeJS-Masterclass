const fs = require('fs');
const http = require('http');
const path = require('path');
const { parse } = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
const slugify = require('slugify');

// const textIn = fs.readFileSync('./txt/input.txt', 'utf8');
//
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
//
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');
/*
fs.readFile('./txt/read-this.txt', 'utf8', (err, data) => {
   if (err) {
       console.log(err);
       return;
   }
    console.log(data);
});

try {
    const output = fs.readFileSync('./txt/input.txt', 'utf8');
    console.log(output);
} catch (err) {
    console.log(err);
}
*/

/*
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        fs.readFile(`./txt/${data2}.txt`, 'utf-8', (err, data3) => {
            console.log(data3);
        })
    })
})


async function readFiles() {
    try {
        const data1 = await fs.readFile('./txt/start.txt', 'utf-8');
        const data2 = await fs.readFile(`./txt/${data1}.txt`, 'utf-8');
        console.log(data2)
        const data3 = await fs.readFile('./txt/append.txt', 'utf-8');
        console.log(data3);

        await fs.writeFile('./txt/final.txt', `${data2}\n${data3}` ,'utf-8');
        console.log('File has been written');
    } catch (err) {
        console.log(err);
    }
}

readFiles();
*/

//////////////////////
// SERVER
// Load API Data (JSON)
const data = fs.readFileSync(
  path.join(__dirname, 'dev-data', 'data.json'),
  'utf8',
);

// JSON Parsed Data
const dataObj = JSON.parse(data);

// SLUGIFLY LINKS
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

// Load Overview Template
const overviewTemplate = fs.readFileSync(
  path.join(__dirname, 'templates', 'template-overview.html'),
  'utf8',
);

// Load Product Template
const productTemplate = fs.readFileSync(
  path.join(__dirname, 'templates', 'template-product.html'),
  'utf8',
);

// Load Card Template
const cardTemplate = fs.readFileSync(
  path.join(__dirname, 'templates', 'template-card.html'),
  'utf8',
);

// Define the server
const server = http.createServer((req, res) => {
  const { method } = req;
  const { query, pathname } = parse(req.url, true);

  // Basic routing
  // Overview Page
  if (method === 'GET' && (pathname === '/' || pathname === '/overview')) {
    res.statusCode = 200;
    res.writeHead(res.statusCode, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(cardTemplate, el))
      .join('');
    const output = overviewTemplate.replace('{{productCards}}', cardsHtml);

    res.end(output);

    // Product Page
  } else if (method === 'GET' && pathname === '/product') {
    const productId = query.id;
    const product = dataObj[productId];

    res.statusCode = 200;
    res.writeHead(res.statusCode, { 'Content-type': 'text/html' });

    const output = replaceTemplate(productTemplate, product);
    res.end(output);

    // API
  } else if (method === 'GET' && pathname === '/api') {
    res.statusCode = 200;
    res.writeHead(res.statusCode, { 'Content-Type': 'application/json' });
    res.end(data);

    // Not Found
  } else {
    res.statusCode = 404;
    res.writeHead(res.statusCode, { 'Content-Type': 'text/html' });
    res.end('<h1>Page not found!</h1>');
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, 'localhost', () => {
  console.log('Server listening on 3000');
});
