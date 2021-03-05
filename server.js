'use strict';
var http = require('http');
var express = require('express');
var pug = require('pug');

var port = process.env.PORT || 1337;

var app = express();

app.get('/', (req, res) => {
    res.send('Hello Joy! Stephen wrote this :)!')
});

app.get('/test', (req, res) => {
    res.send(pug.compileFile('Page1.pug')());
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});