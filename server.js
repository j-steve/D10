'use strict';
var http = require('http');
var express = require('express');
const cookieParser = require("cookie-parser");
var pug = require('pug');

var constants = require('./constants');

var port = process.env.PORT || 1337;
var app = express();
var log = {};

// view engine setup
app.set('views', __dirname + '/public/views');
app.set('view engine', 'pug');

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

app.use('/static', express.static('public'))

// On Startup

app.use((req, res, next) => {
  if (!req.cookies.userId) {
    const userId = getRandomId(6);
    res.cookie('userId', userId, { maxAge: constants.MAX_COOKIE_AGE });
    res.locals.userId = userId;
  } else {
    res.locals.userId = req.cookies.userId
  }
  res.locals.constants = constants;
  next();
});

// Dice Roller ---------------------------------------

app.get('/', (req, res) => {
  res.redirect('/session/test');
});

// Charsheet -----------------------------------------

app.get('/char', (req, res) => {
  res.render('charsheet');
});

// Login ---------------------------------------------

app.get('/login', (req, res) => {
  res.render('login', {charName: req.cookies.charName});
});

app.post('/login', (req, res) => {
  res.cookie('charName', req.body.charName, { maxAge: constants.MAX_COOKIE_AGE });
  // Update the character name in any relevent sessions for this user.
  for (const session of Object.values(log)) {
    if (session[res.locals.userId]) {
      session[res.locals.userId].sessionUser.charName = req.body.charName;
    }
  }
  res.redirect('/')
});

// Session -------------------------------------------

app.get('/session', (req, res) => {
  res.render('session-start');
});
app.get('/session/:sessionId', (req, res) => {
  const charName = req.cookies.charName;
  if (!charName) {
    res.redirect('/login');
  } else {
    req.params.charName = charName;
    res.render('session-roller', req.params);
  }
});

app.post('/session', (req, res) => {
  res.redirect('/session/' + getRandomId(4));
});

// API -----------------------------------------------

app.post('/api/log', (req, res) => {
  const sessionId = req.body.sessionUser.sessionId;
  if (!log[sessionId]) {
    log[sessionId] = {};
  }
  log[sessionId][req.body.sessionUser.userId] = req.body;
  res.send(log[sessionId]);
});

app.post('/api/upsert-session-user', (req, res) => {
  const sessionUser = req.body;
  if (!log[sessionUser.sessionId]) {
    log[sessionUser.sessionId] = {};
  }
  if (!log[sessionUser.sessionId][sessionUser.userId]) {
    log[sessionUser.sessionId][sessionUser.userId] = {};
  }
  log[sessionUser.sessionId][sessionUser.userId].sessionUser = sessionUser;
  res.send(log[sessionUser.sessionId]);
});

app.get('/api/log/:sessionId', (req, res) => {
  res.send(log[req.params.sessionId]);
});

// Server Startup ------------------------------------

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

function getRandomId(length) {
  return Math.random().toString(36).replace(/[0o1li]/gi, '').slice(-length);
}