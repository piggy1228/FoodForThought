var express = require('express');
var path = require('path');

var router = express.Router();

// Connect string to MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'fling.seas.upenn.edu',
  user     : 'leavitts',
  password : '***********************',
  database : 'leavitts'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.get('/create-account', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'insert.html'));
});

// ----Your implemention of route handler for "Insert a new record" should go here-----
router.get('/create-account/data/:login/:name/:sex/:RelationshipStatus/:Birthyear', function(req,res) {
  var query = 'INSERT INTO Person VALUES ("' +
    req.params.login + '", "' +
    req.params.name + '", "' +
    req.params.sex + '", "' +
    req.params.RelationshipStatus + '", ' +
    req.params.Birthyear + ');'
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        console.log('Record Inserted');
    }  
    });
});

module.exports = router;