const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const expressValidator = require("express-validator");
const fs = require("fs");
const cors = require("cors");
dotenv.config();

//Database
console.log(process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI).then(() => console.log("DB connected"));

mongoose.connection.on("error", (err) => {
  console.log(`DB connection error : ${err.message}`);
});

//bring in routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

//apiDocs
app.get("/", (req, res) => {
  fs.readFile("docs/apiDocs.json", (err, data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});

//middleware

const myOwnMiddleware = (req, res, next) => {
  console.log("Middleware applied");
  next();
};

app.use(morgan("dev"));
app.use(myOwnMiddleware);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      error: "unauthorized",
    });
  } else {
    next(err);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`A Node JS API is Listening on port: ${port}`);
});
