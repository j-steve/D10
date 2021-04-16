'use strict';
var http = require('http');
var express = require('express');
const cookieParser = require("cookie-parser");
var pug = require('pug');

var constants = require('./constants');

var port = process.env.PORT || 1337;
var app = express();
var log = [];

// view engine setup
app.set('views', __dirname + '/public/views');
app.set('view engine', 'pug');

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

app.use('/static', express.static('public'))

app.use((req, res, next) => {
  res.locals.constants = constants;
  next();
});

// Dice Roller ---------------------------------------

app.get('/', (req, res) => {
  const charName = req.cookies.charName;
  if (!charName) {
    res.redirect('/login');
  } else {
    res.render('landingpage.pug', { charName });
  }
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
  res.cookie('charName', req.body.charName, {maxAge: 90 * 60 * 60 * 1000 * 24});
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
  const sessionId = Math.random().toString(36).replace(/[0o1li]/gi, '').slice(-4);
  res.redirect('/session/' + sessionId);
});

// API -----------------------------------------------

app.post('/api/log', (req, res) => {
  log.unshift(req.body);
});

app.get('/api/log', (req, res) => {
  res.send(log);
});

// Server Startup ------------------------------------

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
