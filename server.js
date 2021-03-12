'use strict';
var http = require('http');
var express = require('express');
var pug = require('pug');

var port = process.env.PORT || 1337;

var app = express();

var log = [];

app.use(express.urlencoded());
app.use(express.json());

app.use('/static', express.static('public'))

app.get('/', (req, res) => {
    res.send(pug.compileFile('landingpage.pug')());
});

app.get('/char', (req, res) => {
  res.send(pug.compileFile('charsheet.pug')());
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
