const http = require("http");
const app = require("./App");
require("dotenv").config();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log("Server is listenimg", PORT);
});
