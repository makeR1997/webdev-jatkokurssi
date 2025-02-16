// Without Express.js
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!');
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
