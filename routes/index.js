const express = require('express');
const path = require('path');
const oracledb = require('oracledb');
const router = express.Router();
var app = express();

var mongoose = require('mongoose');
var models = require('../models/models');
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
    'SELECT * FROM NEARBY WHERE ROWNUM = 1',
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


router.use(require('cookie-parser')());


router.use('/create-account', function (req, res, next) {
  console.log("REQUEST TYPE IS " + req.method);

  if (req.method == 'POST') {
    if (req.body.login === "login") {

      req.body.success = 0;
      req.body.login = 1;

      next();

    } else {
      var username = req.body.username;
      var email = req.body.email;
      var password = req.body.pass;
      var repeatPass = req.body.repeatpass;
      var login = req.body.login;

      var isValid = 1;

      if (password !== repeatPass) {
        isValid = 0;
      }

      if (password === "" || password == undefined) {
        isValid = 0;
      }

      if (username === "" || username == undefined) {
        isValid = 0;
      }

      if (email === "" || email == undefined) {
        isValid = 0;
      }


      if (isValid) {
        req.body.success = 1;
        next();
      } else {
        req.body.success = 0;
        next();
      }    
    }
  } else {
    req.body.success = 0;
    next();
  }
});

router.post('/', function (req, res, next) {

  if (req.body.login == "login") {
    models.user.find( { username: req.body.user, password: req.body.pass }, function(error, theUser) {
      if (error) {
        //NO IMPLEMENTATION
        console.log(error);
      } else {

        if (theUser !== undefined) {
          console.log(theUser);
          console.log(theUser[0].username);
          res.cookie('user', theUser[0].username);
          res.cookie('email', theUser[0].email);
          res.render('index', { 'user': theUser[0].username});
        } else {
  
          res.render('index', { 'user': 'guest user'});
        }
        
      }
    });   
  } else {
    console.log("CREATE");
    res.render("create-account");
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.cookies);
  var usercookie = req.cookies.user;

  if (!usercookie) {
    res.render('index', {
      'user': 'guest user'
    });
  } else {
    res.render('index', {
      'user': usercookie
    });
  }
});

router.get('/data/:numtravelers/:numrestaurants/:lodgingtypes/:roomtype/', function(req, res, next) {
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
  
minRestaurants = 1; // Hard-coded, for now!
var attributes = "ADR.LATITUDE, ADR.LONGITUDE, A.NAME, A.ID, \
               A.PRICE, A.NEIGHBOURHOOD, A.REVIEW_SCORES_RATING, A.ACCOMMODATES, \
               A.PROPERTY_TYPE, A.ROOM_TYPE";

  var query = "SELECT " + attributes + ", COUNT(*) AS NUM_RESTAURANTS\
               FROM AIRBNB A \
               JOIN AIRBNB_ADDRESS ADR ON A.ID = ADR.ID \
               JOIN NEARBY N ON A.ID = N.ARIBNBID \
               JOIN YELP_DATA Y ON N.YELPID = Y.ID \
               WHERE ACCOMMODATES >= " + parseInt(req.params.numtravelers) +
               " AND ROOM_TYPE = '" + rt + "' ";
  lodgingtypes = req.params.lodgingtypes.split('-');
  for (var i = 0; i < lodgingtypes.length; i++) {
    lt = (lodgingtypes[i]).charAt(0).toUpperCase() + (lodgingtypes[i]).slice(1);
    conj = (i==0) ? "AND (" : "OR";
    query += (conj + " PROPERTY_TYPE = '" + lt + "' ")
  }
  query += (") GROUP BY " + attributes + " HAVING COUNT(*) >= " + req.params.numrestaurants)
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
    connection.execute(query, function(err, result) {
      if (err) {
        console.error(err.message); return;
      } else {
        console.log(result.metaData);
        res.json(result.rows)  // print all returned rows
      }
    });
  }
});

router.get('/airbnb-detail/:id', function(req, res, next) {
  id = req.params.id
  query = 'SELECT * FROM AIRBNB \
           JOIN NEARBY ON AIRBNB.ID = ARIBNBID \
           JOIN YELP_DATA ON YELP_DATA.ID = YELPID \
           WHERE AIRBNB.ID = ' + req.params.id;
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
    connection.execute(query, function(err, result) {
      if (err) {
        console.error(err.message); return;
      } else {
        data = result.rows
        var START_YELP_DATA = 16
        yData = new Array();
        for (var i = 0; i < data.length; i++) {
          matches = (data[i][27]).match(/'(.*?)'/g);
          categories = new Array()
          for (var j = 0; j < matches.length; j++) {
            word = matches[j].substr(1, matches[j].length - 2)
            word = word.charAt(0).toUpperCase() + word.slice(1);
            word = word.replace('_', ' ');
            categories.push({cat: word})
          }

          restaurant = {
            yID: data[i][17],
            yName: data[i][18],
            yURL: data[i][19],
            yPhone: data[i][20],
            yLat: data[i][21],
            yLng: data[i][22],
            yNumReviews: data[i][23],
            yPrice: data[i][24],
            yRating: data[i][25],
            yTransactions: data[i][26],
            yCategories: categories
          };        
          yData.push(restaurant);
        }

        object = {
          aName: data[0][1],
          aURL: data[0][2],
          aNeighbourhood: data[0][3],
          aZipCode: data[0][4],
          aPrice: data[0][5],
          aWeeklyPrice: data[0][6],
          aPropertyType: data[0][7],
          aRoomType: data[0][8],
          aMonthlyPrice: data[0][9],
          aAccomodates: data[0][10],
          aNumReviews: data[0][11],
          aRating: data[0][12],
          aLocationRating: data[0][13],
          yelpData: yData
        }
        res.render('detail', object);
      }
    });
  }
});

router.get('/account', function (req, res, next) {

  if (req.cookies.user !== undefined) {

    models.user.find( { username: req.cookies.user, email: req.cookies.email }, function(error, theUser) {
      if (error) {
        //NO IMPLEMENTATION
        console.log(error);
      } else {

        if (theUser[0] !== undefined) {
          console.log(theUser);
          console.log(theUser[0].username);
          res.render('account', { 'user': theUser[0]});
        } else {

          res.render('insert', { 'message' : "<div class='alert alert-danger' role='alert'>" + 
            "You are not registered, please create a new account!</div>"});
        }
      }
    });
  } else {
    res.render('insert', { 'message' : "<div class='alert alert-danger' role='alert'>" + 
            "You are not registered, please create a new account!</div>"});
  }
  
  
});
router.post('/account', function (req, res, next) {

  if (req.body.login == "login") {
    models.user.find( { username: req.body.user, password: req.body.pass }, function(error, theUser) {
      if (error) {
        //NO IMPLEMENTATION
        console.log(error);
      } else {

        if (theUser[0] !== undefined) {
          console.log(theUser);
          console.log(theUser[0].username);
          res.cookie('user', theUser[0].username);
          res.cookie('email', theUser[0].email);
          res.render('index', { 'user': theUser[0].username, 'message': "<div class='alert alert-success' id='success-alert' role='alert' style='text-align = center;'>" + 
            "Logged in :)</div>"});
        } else {
  
          res.render('insert', { 'message' : "<div class='alert alert-danger' role='alert'>" + 
            "You are not registered, please create a new account!</div>"});
        }
      }
    });   
  } else {
    console.log("CREATE");
    res.render("index");
  }
});


router.get('/create-account', function (req, res, next) {
  console.log(res.message);
  res.render('insert');
});

router.post('/create-account', function (req, res, next) {

  if (req.body.login == 1) {

    console.log("username is " + req.body.user);
    console.log("password is " + req.body.pass);
    models.user.find( { username: req.body.user, password: req.body.pass }, function(error, theUser) {
      if (error) {
        //NO IMPLEMENTATION
        console.log(error);
      } else {

        if (theUser[0] !== undefined) {
          console.log(theUser);
          console.log(theUser[0].username);
          res.cookie('user', theUser[0].username);
          res.cookie('email', theUser[0].email);
          res.render('index', { 'user': theUser[0].username, 'message': "<div class='alert alert-success' id='success-alert' role='alert' style='text-align = center;'>" + 
            "Logged in :)</div>"});
        } else {
  
          res.render('insert', { 'message' : "<div class='alert alert-danger' role='alert'>" + 
            "You are not registered, please create a new account!</div>"});
        }
        
      }
    });

  } else {
    console.log(req.body.username);
    console.log(req.body.email);
    console.log(req.body.pass);
    console.log(req.body.success);

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.pass;
    
    if (req.body.success) {
      // DO DATABASE THINGS

      res.cookie('user', username);
      res.cookie('email', email);
      var newUser = new models.user({
        username: username,
        email: email,
        password: password
      });
      
      newUser.save(function(error) {

      });

      console.log("DO DATABASE THINGS");
      res.render('index', { 'user': username, 'message': "<div class='alert alert-success' id='success-alert' role='alert' style='text-align = center;'>" + 
            "Successfully created your account! Start planning now :)</div>"});

    } else {
      console.log("DONT DO DATABASE THINGS");
      if (req.cookies.user) {
        res.render('insert', { 'message' : "<div class='alert alert-danger' role='alert'>" + 
            "Please make sure you entered valid signup information. " +
            "Also, you already are logged into an account, are you sure you want to create a new one?</div>"});
      } else {
          res.render('insert', { 'message' : "<div class='alert alert-danger' role='alert'>" + 
            "You entered invalid signup information. Please try again.</div>"});
      } 
    }    
  }
});

router.get('/logout', function (req, res, next) {
  res.clearCookie('user');
  res.clearCookie('email');
  res.render('index', { 'user': 'guest user'});
});

router.get('/init', function(req, res, next) {
  var query = 'SELECT DISTINCT NEIGHBOURHOOD FROM AIRBNB'
  
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
    connection.execute(query, function(err, result) {
      if (err) {
        console.error(err.message); return;
      } else {
        res.json(result.rows)  // print all returned rows
      }
    });
  }
});


module.exports = router;