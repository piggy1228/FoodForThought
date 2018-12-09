var app = angular.module('foodForThought',[]);

app.controller('mainFormController', function($scope, $http) {
    $scope.Submit = function() {
        console.log('HELLO!')
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

            angular.forEach($scope.data, function(value, index) {
                console.log('Hi!  You are inside angular.forEach function');
                var lat = value.latitude;
                var lng = value.longitude;
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, lng),
                    map: Map.map
                });
            });
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