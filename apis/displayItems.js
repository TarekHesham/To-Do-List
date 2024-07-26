const fs = require('fs');
const data = JSON.parse(fs.readFileSync("./data.json", { encoding: 'utf-8' }));

module.exports = {
  name: "items",
  method: "GET",
  run: (req, res, query) => {
    // Search if inside query id
    let itemDisplay = null;
    if (query?.id) {
      itemDisplay = data.find((item) => item.id === query.id);
      if (!itemDisplay) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ status: 404, data: "Not found !!" }));
      }
    } else {
      itemDisplay = data;
    }

    // Res with data
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: 200, data: itemDisplay }));
  },
};
