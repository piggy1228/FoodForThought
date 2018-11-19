var express = require('express');
var router = express.Router();
var path = require('path');

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

router.get('/reference', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'reference.html'));
});

router.get('/insert', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'insert.html'));
});

router.get('/showfriends', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'showfriends.html'));
});

router.get('/showfamily', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'showfamily.html'));
});

router.get('/data/:email', function(req,res) {
  var query = (req.params.email == 'undefined') ? 'SELECT * from Person' :
        'SELECT * from Person WHERE login = "' + req.params.email + '"'
  // note that email parameter in the request can be accessed using "req.params.email"
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
    }  
    });
});

// ----Your implemention of route handler for "Insert a new record" should go here-----
router.get('/insert/data/:login/:name/:sex/:RelationshipStatus/:Birthyear', function(req,res) {
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

router.get('/showfriends/:fr_email', function(req,res) {
  var query = 'SELECT DISTINCT fr.friend \
               FROM Person p \
               JOIN Family f ON p.login = f.login \
               JOIN Friends fr ON fr.login = p.login OR fr.login = f.member \
               WHERE p.login = "' + req.params.fr_email + '" \
               AND fr.friend != p.login;'
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
    }  
    });
});

router.get('/showfamily/:selectedLogin', function(req,res) {
  var query = 'SELECT p.login, p.name, p.sex, \
               p.relationshipStatus, p.birthyear \
               FROM Family f \
               JOIN Person p ON f.member = p.login \
               WHERE f.login = "' + req.params.selectedLogin + '";'
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
    }  
    });
});

router.get('/init', function(req, res) {
  var query = 'SELECT DISTINCT login FROM Family'
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
    });
});

module.exports = router;