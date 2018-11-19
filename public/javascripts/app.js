var app = angular.module('foodForThought',[]);
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