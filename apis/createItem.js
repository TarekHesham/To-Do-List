const fs = require("fs");

module.exports = {
  name: "createItem",
  method: "POST",
  run: (req, res, query) => {
    // Get data from request
    let body = "";
    req.on("data", function (data) {
      // add data to var
      body += data;

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6) req.connection.destroy();
    });

    req.on("end", function () {
      if (!body) {
        res.writeHead(405, { "Content-Type": "application/json" });
        return res.end("Where item !!");
      }

      const data = JSON.parse(
        fs.readFileSync("./data.json", { encoding: "utf-8" })
      );

      data.push({
        id: data.length ? `${+data[data.length - 1].id + 1}` : "1",
        item: body.replace(/"/g, ''),
        status: false
      });

      fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));

      // Res when success
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("Done Add data");
    });
  },
};
