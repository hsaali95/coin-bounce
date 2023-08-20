const express = require("express");
const dbConnect = require("./database/index");
const { PORT } = require("./config/index");

const app = express();
app.get("/", (req, res) => {
  res.send("hello ahmed");
});
dbConnect();

app.listen(PORT, console.log(`Backend is running on port : ${PORT}`));
