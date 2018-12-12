var app = angular.module('foodForThought',[]);

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
    $scope.num_restaurants = 5;
    $scope.lodgingtype = {
        apartment:false,
        condominium:false,
        loft:false,
        house:false,
        hotel:false,
        hostel:false,
        other:false
    }
    $scope.roomtype = 'entire-home'
    $lp = 250;
    $rp = 3;

    // Set up map
    var mapOptions = {
      center: new google.maps.LatLng(40.758896, -73.985130),
      zoom: 12,
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];

    var infoWindow = new google.maps.InfoWindow;

    $scope.toggleAll = function() {
        if ($scope.toggle == true) {
            $scope.lodgingtype = {
                apartment:true,
                condominium:true,
                loft:true,
                house:true,
                hotel:true,
                hostel:true,
                other:true
            }
        } else {
            $scope.lodgingtype = {
                apartment:false,
                condominium:false,
                loft:false,
                house:false,
                hotel:false,
                hostel:false,
                other:false
            }            
        }
        console.log($scope.lodgingtype)
    }


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
      var rank = row[10];
      var sameNeighbourhood = row[11];
      var num_rest = row[12];

      if (neighborhood == null) {
          neighborhood = '';
      }

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

    var removeSuggestions = function() {
      document.getElementById('suggestions-wrapper').innerHTML = '';
    }

    var addSuggestions = function(row) {
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
      var rank = row[10];
      var sameNeighbourhood = row[11];
      var num_rest = row[12];

      if (neighborhood == null) {
          neighborhood = '';
      }

      var entry = document.createElement('a');
      entry.setAttribute('class', 'list-group-item');
      entry.setAttribute('href', '/airbnb-detail/' + airbnb_id);
      entry.setAttribute('style', 'color:black');

      var heading = document.createElement('h4');
      var description = document.createElement('text');

      heading.setAttribute('class' ,'list-group-item-heading')
      description.setAttribute('class', 'list-group-item-text');

      heading.textContent = name;
      description.textContent = 
        'Price per night: ' + price +
        ' | Average Rating: ' + score +
        ' | Our rating for you: ' + rank;

      entry.appendChild(heading);
      entry.appendChild(document.createElement('br'));
      entry.appendChild(description);
      document.getElementById('suggestions-wrapper').appendChild(entry);
    }

    $scope.Submit = function() {
        console.log('Submitted!');

        var selected_types = new Array();
        Object.keys($scope.lodgingtype).forEach(function(key,index) {
            console.log(key);
            console.log($scope.lodgingtype[key]);
            if($scope.lodgingtype[key] == true) {
                selected_types.push(key);
            }
        });
        console.log(selected_types);
        if (selected_types.length == 0) {
            var ltypes = '-'
        } else {
            var ltypes = selected_types.join('-')
        }
        console.log(ltypes);

        request_string = '/data/' +
        //
        // Insert price ranges of lodging and restaurants
        //
        $scope.num_travelers + '/' +
        $scope.num_restaurants + '/' + 
        ltypes + '/' + // lodgingtypes, separated by a hyphen (-)
        $scope.roomtype + '/' + 
        $scope.lp + '/' + 
        $scope.rp + '/' + 
        $scope.goodtypes + '/' + 
        $scope.badtypes + '/' + 
        $scope.neighbourhood + '/'
        var request = $http.get(request_string);
        request.success(function(data) {
            console.log(data);
            $scope.data = data;
            clearMarkers();
            removeSuggestions() // TODO: IMPLEMENT THIS!

            var heading = document.createElement('h2');
            heading.setAttribute('style', 'font-weight:bold');
            heading.textContent = 'Our top recommendations for you:'
            document.getElementById('suggestions-wrapper').appendChild(heading);
            for (i = 0; i < data.length; i++) {
                createMarker(data[i]);
                if (i < 5) {
                    addSuggestions(data[i]);
                }
            }

        });
        request.error(function(data) {
            console.log('error on request: ' + request_string);
        })
    }
})