// Without Express.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'webpage1.html' : req.url);
    const extname = path.extname(filePath);
    let contentType = 'text/html';

    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'font/woff',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'font/otf',
        '.wasm': 'application/wasm'
    };

    if (mimeTypes[extname]) {
        contentType = mimeTypes[extname];
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
