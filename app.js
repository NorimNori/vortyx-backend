require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const expressWinston = require("express-winston");
const winston = require("winston");
const { errors } = require("celebrate");

const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const gamesRouter = require("./routes/games");
const moviesRouter = require("./routes/movies");
const searchRouter = require("./routes/search");

const authMiddleware = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");
const { NotFoundError } = require("./errors");

const { MONGO_URI = "mongodb://localhost:27017/vortyx" } = process.env;

const app = express();

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Error MongoDB:", err));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressWinston.logger({
    transports: [new winston.transports.File({ filename: "logs/request.log" })],
    format: winston.format.json(),
    requestWhitelist: ["url", "headers", "method", "httpVersion", "query"],
    responseWhitelist: ["statusCode"],
  }),
);

app.use(authRouter);

app.use(authMiddleware);
app.use("/users", usersRouter);
app.use("/games", gamesRouter);
app.use("/movies", moviesRouter);
app.use("/search", searchRouter);

app.use((req, res, next) => {
  next(new NotFoundError("Ruta no encontrada"));
});
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.File({ filename: "logs/error.log" })],
    format: winston.format.json(),
  }),
);

app.use(errors());

app.use(errorHandler);

module.exports = app;
