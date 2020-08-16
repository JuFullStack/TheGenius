var createError = require("http-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
const userCtrl = require("./api/user/user.ctrl");
const UserModel = require("./models/user");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
require("dotenv").config();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(userCtrl.checkAuth);

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/api", require("./api"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

var users = {};
var user_count = 0;
var turn_count = 0;

io.on("connection", function (socket) {
  console.log("user connected : ", socket.id);

  socket.on("join", function (data) {
    var username = data.username;
    socket.username = username;

    users[user_count] = {};
    users[user_count].id = socket.id;
    users[user_count].name = username;
    users[user_count].turn = false;
    users[user_count].tile = data.tile;
    user_count++;

    io.emit("update_users", users, user_count);
  });

  socket.on("game_start", function (data) {
    console.log("game_start");
    users[turn_count].turn = true;
    socket.broadcast.emit("game_started", data);
    console.log(users[turn_count]);

    io.emit("update_users", users);
  });

  socket.on("select", function (data) {
    socket.broadcast.emit("check_number", data);

    users[turn_count].turn = false;
    turn_count++;

    if (turn_count >= user_count) {
      turn_count = 0;
    }
    users[turn_count].turn = true;

    io.sockets.emit("update_users", users);
  });

  socket.on("disconnect", function () {
    console.log("user disconnected : ", socket.id, socket.username);
    for (var i = 0; i < user_count; i++) {
      if (users[i].id == socket.id) delete users[i];
    }

    user_count--;
    io.emit("update_users", users, user_count);
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});

module.exports = app;
