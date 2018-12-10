var app = angular.module('foodForThought',[]);

app.controller('mainController', function($scope, $http) {

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
      var url = row[3];
      var price = row[4];
      var neighborhood = row[5];
      var score = row[6];
      var accomodates = row[7];
      var property_type = row[8];
      var room_type = row[9];

      var infowincontent = document.createElement('div');
      var link = document.createElement('a');
      var strong = document.createElement('h4');
      strong.textContent = name;
      link.setAttribute('href', url);
      link.appendChild(strong);
      var description = document.createElement('strong');
      var description2 = document.createElement('text');
      description.textContent = neighborhood + ' ' + 
        property_type + ' (' + room_type + ')'
      description2.textContent = 
        'Price per night: ' + price +
        ' | Average Rating: ' + score +
        ' | Accomodates up to ' + accomodates;

      infowincontent.appendChild(link);
      infowincontent.appendChild(description)
      infowincontent.appendChild(document.createElement('br'));
      infowincontent.appendChild(description2)


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
        resStr + '/' + // lodgingtypes, separates by a hyphen (-)
        $scope.roomtype + '/'
        var request = $http.get(request_string);
        request.success(function(data) {
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


// app.controller('mapController', function($scope, $http) {

// });

app.controller('createAccountController', function($scope, $http) {
    $scope.message="";
    $scope.Insert = function() {
        var request = $http.get('/create-account/data/' +
            $scope.login + '/' +
            $scope.name + '/' +
            $scope.sex + '/' +
            $scope.RelationshipStatus + '/' +
            $scope.Birthyear + '/');
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });

    };
});