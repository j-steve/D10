'use strict';
var http = require('http');
var express = require('express');
const cookieParser = require("cookie-parser");
var pug = require('pug');

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

app.get('/', (req, res) => {
  const charName = req.cookies.charName;
  console.log('charName is', req.cookies);
  if (charName) {
    res.render('landingpage.pug', {charName});
  } else {
    res.redirect('/login');
  }
});

app.get('/char', (req, res) => {
  res.render('charsheet');
});

app.get('/login', (req, res) => {
  res.render('login', {charName: req.cookies.charName});
});

app.post('/login', (req, res) => {
  res.cookie('charName', req.body.charName, {maxAge: 90 * 60 * 60 * 1000 * 24});
  res.redirect('/')
});

app.post('/api/log', (req, res) => {
  log.unshift(req.body);
});

app.get('/api/log', (req, res) => {
  res.send(log);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
