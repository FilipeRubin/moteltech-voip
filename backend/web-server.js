// --- Webpage hosting script ---
// 
// This is a script that returns every .html, .js or .css file requested by a web browser.
// It treats the folder pointed in "publicDir" as its source path for retrieving the files.
// The server will be hosted on localhost using the port specified by the "PORT" constant.
// Run it with Node.JS
// 
// By: Filipe Rubin, with a gentle help from ChatGPT

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 12500;
const publicDir = path.join(__dirname, '..', 'frontend');

// Maps file extensions to Content-Type
const mimeTypes = {
  '.html': 'text/html',
  '.js':   'text/javascript',
  '.css':  'text/css'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // Prevent directory traversal attacks
  if (!filePath.startsWith(publicDir))
  {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
