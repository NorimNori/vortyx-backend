require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");

const { MONGO_URI = "mongodb://localhost:27017/vortyx" } = process.env;
const { PORT = 3001 } = process.env;

const app = express();

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Error MongoDB:", err));

app.use(express.json());

app.use(authMiddleware);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));

module.exports = app;
