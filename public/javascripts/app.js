var app = angular.module('angularjsNodejsTutorial',[]);
app.controller('myController', function($scope, $http) {
    $scope.message="";
    $scope.Submit = function() {
        var request = $http.get('/data/'+$scope.email);
        request.success(function(data) {
            $scope.data = data;
            console.log(data);
        });
        request.error(function(data){
            console.log('err');
        });
    
    }; 
});

// To implement "Insert a new record", you need to:
// - Create a new controller here
// - Create a corresponding route handler in routes/index.js
app.controller('insertController', function($scope, $http) {
    $scope.message="";
    $scope.Insert = function() {
        var request = $http.get('/insert/data/' +
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

// (4). Show Friends
app.controller('friendsController', function($scope, $http) {
    $scope.message="";
    $scope.ShowFriends = function() {
        var request = $http.get('/showfriends/'+$scope.fr_email);
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });
    
    }; 
});

// (5). Show Family
app.controller('familyController', function($scope, $http) {    
    var request = $http.get('/init');
    request.success(function(data) {
        $scope.logins = data;
    });
    request.error(function(data){
        console.log('err');
    });

    $scope.message="";
    $scope.ShowFamily = function() {
        var request = $http.get('/showfamily/'+$scope.selectedLogin.login);
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });
    }

});