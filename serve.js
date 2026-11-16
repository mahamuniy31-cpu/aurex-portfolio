const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3033;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  let reqUrl = decodeURIComponent(req.url.split('?')[0]);
  if (reqUrl === '/' || reqUrl === '') reqUrl = '/index.html';

  let filePath = path.join(ROOT_DIR, reqUrl);

  // If request is looking for a project sibling like ../lumina-gallery
  if (reqUrl.startsWith('/lumina-gallery') || reqUrl.startsWith('/nova-calc')) {
    filePath = path.join(ROOT_DIR, '..', reqUrl);
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    const notFoundPath = path.join(ROOT_DIR, '404.html');
    if (fs.existsSync(notFoundPath)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(notFoundPath));
      return;
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`   AUREX PORTFOLIO SERVER RUNNING`);
  console.log(`   Local URL: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
