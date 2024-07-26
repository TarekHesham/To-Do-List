const http = require("http");
const url = require('url');
const fs = require('fs');

// Create Handler
const apisFolder = fs.readdirSync("./apis", { encoding: 'utf-8' });
const apis = new Map();
for (let apiFiles of apisFolder) {
  const apiFile = require(`./apis/${apiFiles}`);
  apis.set(apiFile.name, apiFile);
};

// Create a local server to receive data from
const server = http.createServer();

// Listen to the request event
server.on('request', (request, res) => {
  const { query, pathname } = url.parse(request.url, true);

  // Home page
  if (pathname === "/") {
    return fs.readFile("./pages/index.html", (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }
  
  if (!apis.has(pathname.slice(1))) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    return  res.end("<h1>404 | Not Found</h1>");
  };

  const callBack = apis.get(pathname.slice(1));
  if (callBack.method !== request.method) {
    res.writeHead(405, { 'Content-Type': 'text/html' });
    return res.end("<h1>Bad Request Method</h1>");
  }

  return callBack.run(request, res, query);
});

server.listen(3000, 'localhost', () => {
    console.log("Server up in http://localhost:3000");
});