const http = require("http");
const app = require("./App");
const { default: mongoose } = require("mongoose");
// const app = require("./app");
require("dotenv").config();

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Proceed with your application logic
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log("Server is listenimg", PORT);
});
