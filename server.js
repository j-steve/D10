'use strict';
var http = require('http');
var express = require('express');
var pug = require('pug');

var port = process.env.PORT || 1337;

var app = express();

app.use(express.static('public'));
app.use('/static', express.static('public'))

app.get('/', (req, res) => {
    res.send(pug.compileFile('landingpage.pug')());
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
