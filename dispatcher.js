///**
// * Created by incognito on 11.03.16.
// */
//
//var data    = require('./data');
//
//var express = require('express');
//
//var app = express.createServer();
//
//var mysql = require('mysql');
//
//
//
//app.get('/', function(req, res){
//    res.send('Hello World');
//});
//
//app.get('/s', function(req, res){
//    res.send('new request!');
//});
//
//app.get('/add', function(req, res){
//    res.send('data added!');
//    data.add(req.query.name, req.query.earnings, req.query.parent);
//});
//
//app.get('/show', function(req, res){
//    connection.query("SELECT * FROM companies WHERE 1",  function(err, result) {
//        res.send({ object: result });
//        res.render('index.html', { object: result });
//    });
//});
//
//app.listen(3000);