const express = require('express');
const path = require('path');
const oracledb = require('oracledb');
const router = express.Router();

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

  YELP_DATA SCHEMA:
  [ { name: 'CAMIS' },
  { name: 'ID' },
  { name: 'NAME' },
  { name: 'URL' },
  { name: 'PHONE' },
  { name: 'LATITUDE' },
  { name: 'LONGITUDE' },
  { name: 'REVIEW_COUNT' },
  { name: 'PRICE' },
  { name: 'RATING' },
  { name: 'TRANSACTIONS' },
  { name: 'CATEGORIES' },
  { name: 'ADDRESS' },
  { name: 'CITY' },
  { name: 'STATE' },
  { name: 'ZIP_CODE' } ]

  AIRBNB_ADDRESS SCHEMA:
  [ { name: 'ID' },
  { name: 'NEIGHBOURHOOD' },
  { name: 'ZIPCODE' },
  { name: 'LATITUDE' },
  { name: 'LONGITUDE' } ]
*/


// Connect string to Oracle DB

/*
var connection = oracledb.getConnection(
  {
  user     : 'foodforthought',
  password : 'foodforthought',
  connectString : '//fftdb.cffkxucetyjv.us-east-2.rds.amazonaws.com:1521/FFT'
  },
  connExecute
);

function connExecute(err, connection) {
  if (err) {
    console.error(err.message);
    return;
  }
  connection.execute(
    'SELECT DISTINCT CATEGORIES FROM YELP_DATA',
    function(err, result) {
      if (err) {
        console.error(err.message); return;
      } else {
        console.log(result.metaData);
        console.log(result.rows);  // print all returned rows
      }
    });
}
*/


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.get('/data/:numtravelers/:lodgingtypes/:roomtype/', function(req, res, next) {
  switch(req.params.roomtype) {
    case 'private-room':
      var rt = 'Private room'
      break;
    case 'shared-room':
      var rt = 'Shared room'
      break;
    case 'entire-home':
      var rt = 'Entire home/apt'
      break;
  }
  
  var query = "SELECT * FROM AIRBNB \
               JOIN AIRBNB_ADDRESS ON AIRBNB.ID = AIRBNB_ADDRESS.ID \
               WHERE ACCOMMODATES >= " + parseInt(req.params.numtravelers) +
               " AND ROOM_TYPE = '" + rt + "' ";
  lodgingtypes = req.params.lodgingtypes.split('-');
  for (var i = 0; i < lodgingtypes.length; i++) {
    lt = (lodgingtypes[i]).charAt(0).toUpperCase() + (lodgingtypes[i]).slice(1);
    conj = (i==0) ? "AND (" : "OR";
    query += (conj + " PROPERTY_TYPE = '" + lt + "' ")
  }
  query += ")"
  console.log(query);


  var connection = oracledb.getConnection(
    {
    user     : 'foodforthought',
    password : 'foodforthought',
    connectString : '//fftdb.cffkxucetyjv.us-east-2.rds.amazonaws.com:1521/FFT'
    },
    connExecute
  );

  function connExecute(err, connection) {
    if (err) {
      console.error(err.message);
      return;
    }
    connection.execute(
      query,
      function(err, result) {
        if (err) {
          console.error(err.message); return;
        } else {
          console.log(result.metaData);
          console.log(result.rows);  // print all returned rows
        }
      });
  }




});

router.get('/create-account', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'insert.html'));
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

module.exports = router;