var app = angular.module('foodForThought',[]);


app.controller('loginController', function($scope, $http) {
    $scope.login() = function {
      console.log($scope);
      var user = document.getElementById('email-input').value;
      var pass = document.getElementById('password-input').value;

      console.log("USER IS " + user);
      console.log("PASSWORD IS " + pass);
      var req = {
         method: 'POST',
         url: '/',
         data: { 'user': user, 'pass': pass }
      };

      $http(req);

    }

})
app.controller('mainController', function($scope, $http) {
    
    // Initialize fields in neighborhood dropdown
    var request = $http.get('/init');
    request.success(function(data) {
        $scope.neighbourhoods = data;
        console.log($scope.neighbourhoods)
    });
    request.error(function(data){
        console.log('err');
    });

    
    // Initialize form values
    $scope.num_travelers = 2;
    $scope.num_restaurants = 1;


    // Set up map
    var mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(40.758896, -73.985130),
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];

    var infoWindow = new google.maps.InfoWindow;

    var clearMarkers = function() {
        for (var i = 0; i < $scope.markers.length; i++) {
            $scope.markers[i].setMap(null)
        }
        $scope.markers = [];
    }

    var createMarker = function(row) {
      var lat = row[0];
      var lng = row[1];
      var name = row[2];
      var airbnb_id = row[3];
      var price = row[4];
      var neighborhood = row[5];
      var score = row[6];
      var accomodates = row[7];
      var property_type = row[8];
      var room_type = row[9];
      var num_rest = row[10];

      var infowincontent = document.createElement('div');
      var link = document.createElement('a');
      var strong = document.createElement('h4');
      strong.textContent = name;
      link.setAttribute('href', '/airbnb-detail/' + airbnb_id);
      link.appendChild(strong);
      var description = document.createElement('strong');
      var description2 = document.createElement('text');
      var description3 = document.createElement('text');
      description3.setAttribute('style', 'color:tomato;')

      description.textContent = neighborhood + ' ' + 
        property_type + ' (' + room_type + ')'
      description2.textContent = 
        'Price per night: ' + price +
        ' | Average Rating: ' + score +
        ' | Accomodates up to ' + accomodates;
      // Use ternary to correctly display 'restaurant' or 'restaurants'
      description3.textContent = (num_rest == 1) ?
        'Found 1 nearby restaurant suiting you!' :
        'Found ' + num_rest + ' nearby restaurants for you!';


      infowincontent.appendChild(link);
      infowincontent.appendChild(description)
      infowincontent.appendChild(document.createElement('br'));
      infowincontent.appendChild(description2)
      infowincontent.appendChild(document.createElement('br'));
      infowincontent.appendChild(description3)


      var marker = new google.maps.Marker({
        map: $scope.map,
        position: new google.maps.LatLng(lat, lng),
        title: "lat: " + lat + ",lng: " + lng
      });

      marker.addListener('click', function() {
        infoWindow.setContent(infowincontent);
        infoWindow.open(map, marker);
      });

      $scope.markers.push(marker);
    }

    $scope.Submit = function() {
        console.log('Submitted!');
        matches = JSON.stringify($scope.lodgingtype).match(/"(.*?)":/g)
        resStr = '';
        for (x in matches) {
            resStr = resStr + matches[x].substr(1,matches[x].length-3)
            if (x != matches.length - 1) {
                resStr += '-'
            }
        }
        request_string = '/data/' +
        //
        // Insert price ranges of lodging and restaurants
        //
        $scope.num_travelers + '/' +
        $scope.num_restaurants + '/' + 
        resStr + '/' + // lodgingtypes, separated by a hyphen (-)
        $scope.roomtype + '/'
        var request = $http.get(request_string);
        request.success(function(data) {
            console.log(data);
            $scope.data = data;
            clearMarkers();
            for (i = 0; i < data.length; i++) {
                createMarker(data[i]);
            }
        });
        request.error(function(data) {
            console.log('error on request: ' + request_string);
        })
    }
})