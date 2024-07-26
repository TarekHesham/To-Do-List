const fs = require('fs');

module.exports = {
  name: "deleteItem",
  method: "POST",
  run: (req, res, query) => {
    // Get data from request
    let idItem = "";
    req.on("data", function (data) {
      // add data to var
      idItem += data;

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (idItem.length > 1e6) req.connection.destroy();
    });

    req.on("end", function () {
      if (!idItem) {
        res.writeHead(405, { "Content-Type": "application/json" });
        return res.end("Where item !!");
      }

      const data = JSON.parse(
        fs.readFileSync("./data.json", { encoding: "utf-8" })
      );

      const findItem = data.find(item => item.id === idItem);
      if (!findItem) {
        res.writeHead(405, { "Content-Type": "application/json" });
        return res.end("Cant find id item !!");
      }

      data.splice(data.indexOf(findItem), 1);
      fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));

      // Res when success
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("Done Deleted data");
    });
  },
};
