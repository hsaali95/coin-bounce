const express = require("express");
const dbConnect = require("./database/index");
const { PORT } = require("./config/index");
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.use(express.json()); // allow app to communicate data in json

app.use(router);

dbConnect();

app.use("/storage", express.static("storage"));

app.use(errorHandler); //middle used to update req or res objects

app.listen(PORT, console.log(`Backend is running on port : ${PORT}`));
