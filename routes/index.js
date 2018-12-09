const express = require('express');
const path = require('path');
//const oracledb = require('oracledb');
const router = express.Router();
var cookieParser = require('cookie-parser');
var app = express();

/*
Databases:
(result of query 'SELECT table_name FROM user_tables')
[ { name: 'TABLE_NAME' } ]
[ [ 'YELP_TOTAL_DB' ],
  [ 'ARIBNBTOTALTABLE' ],
  [ 'AIRBNB_ADDRESS' ],
  [ 'AIRBNB' ],
  [ 'AIRBNB_HOST' ],
  [ 'AIRBNB_ROOMREVIEW' ],
  [ 'AIRBNB_ROOMTYPE' ],
  [ 'YELP_ADDRESS' ],
  [ 'YELP_DATA' ] ]

  AIRBNB SCHEMA:
  [ { name: 'ID' },
  { name: 'NAME' },
  { name: 'LISTING_URL' },
  { name: 'NEIGHBOURHOOD' },
  { name: 'ZIPCODE' },
  { name: 'PRICE' },
  { name: 'WEEKLY_PRICE' },
  { name: 'PROPERTY_TYPE' },
  { name: 'ROOM_TYPE' },
  { name: 'MONTHLY_PRICE' },
  { name: 'ACCOMMODATES' },
  { name: 'NUMBER_OF_REVIEWS' },
  { name: 'REVIEW_SCORES_RATING' },
  { name: 'REVIEW_SCORES_LOCATION' } ]
*/


// Connect string to Oracle DB


// var connection = oracledb.getConnection(
//   {
//   user     : 'foodforthought',
//   password : 'foodforthought',
//   connectString : '//fftdb.cffkxucetyjv.us-east-2.rds.amazonaws.com:1521/FFT'
//   },
//   connExecute
// );

// function connExecute(err, connection) {
//   if (err) {
//     console.error(err.message);
//     return;
//   }
//   connection.execute(
//     'SELECT DISTINCT ROOM_TYPE FROM AIRBNB',
//     function(err, result) {
//       if (err) {
//         console.error(err.message); return;
//       } else {
//         console.log(result.metaData);
//         console.log(result.rows);  // print all returned rows
//       }
//     });
// }

app.use(cookieParser());

router.use(require('cookie-parser')());

router.use('/create-account', function (req, res, next) {
  console.log("REQUEST TYPE IS " + req.method);
  if (req.method == 'POST') {

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.pass;
    var repeatPass = req.body.repeatpass;
    var isValid = 1;

    if (password !== repeatPass) {
      isValid = 0;
    }

    if (password === "") {
      isValid = 0;
    }

    if (username === "") {
      isValid = 0;
    }

    if (isValid) {
      req.body.success = 1;
      next();
    } else {
      req.body.success = 0;
      res.cookie('USER', email);
      res.redirect('create-account');
    }

  } else {

    req.body.success = 0;
    next();
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.cookies);
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.get('/:lat/:lon/:zoom', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.get('/create-account', function (req, res, next) {
  console.log(res.message);
  res.sendFile(path.join(__dirname, '../', 'views', 'insert.html'));
});

router.post('/create-account', function (req, res, next) {

  console.log(req.body.username);
  console.log(req.body.email);
  console.log(req.body.pass);
  console.log(req.body.success);

  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.pass;
  
  if (req.body.success) {
    // DO DATABASE THINGS

    console.log("DO DATABASE THINGS");
  } else {
    console.log("DONT DO DATABASE THINGS");
  }

  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

/*
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
*/

app.listen(3000);
module.exports = router;