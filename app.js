const express = require("express");
const path = require("path");
const session = require("express-session");
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

require('dotenv').config()

const mongoDb = process.env.MONGODBKEY;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const User = require("./models/user");
const Post = require("./models/post");

passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { 
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              return done(null, user)
            } else {
              return done(null, false, { message: "Incorrect password" })
            }
        })
      });
    })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

const router = require("./routes/routes");

const app = express();

app.engine('ejs', require('express-ejs-extend'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use('/', router);

app.use(function(req, res, next) {
  next(createError(404));
});


module.exports = app;