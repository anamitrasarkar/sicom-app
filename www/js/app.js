var app = angular.module("App", ['ngRoute']);


app.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: 'home.html',
      controller: 'SicomCtrl'
    })
    .when('/store-auth', {
      templateUrl: 'store-auth.html',
      controller: 'SicomAuthCtrl'
    })
    .when('/access-community', {
      templateUrl: 'access-community.html',
      controller: 'AccessCommunityCtrl'
    })
    .otherwise({
      redirectTo: '/home'
    });
    // //use the HTML5 History API
    // // $locationProvider.html5Mode(true);
    // $locationProvider.html5Mode({
    //   enabled: true,
    //   requireBase: false
    // });
});


app.controller('SicomCtrl', function($scope, SicomFactory, $location, SicomService) {
  console.info('Inside SicomCtrl...')
  $scope.message = "Technologies Powering Restaurant Transformation";
  $scope.storeCode = "dummy store code";
  var promise;
  $scope.getStoreCode = function(storeId){
    var storeData = storeId;
    console.log('INFO', 'Getting store code...');
    console.log('INFO', storeData);
    if(storeData){
      promise = SicomFactory.getStoreCode(storeData);

      promise.then(function(data){
        if(data){
          console.log('Store Code', data);
          SicomService.setstoreCode(data);
          $location.path('/store-auth');
          $location.replace(); // to avoid browser history
        }
      }, function(error){
        console.info('Error - ', JSON.stringify(error));
      });
    }
  }

});


app.controller('SicomAuthCtrl', function($scope, SicomService, $location, SicomFactory){
  $scope.storeCode = SicomService.getstoreCode();
  $scope.Community;
  $scope.navigateHome = function(){
    $location.path('/home');
    $location.replace();
  };


  $scope.getKowledgeArticles = function(){
    console.info('Retrieving knowledge articles');
    var communityCredentials = $scope.Community;
    console.log('username : ', communityCredentials.username);
    $location.path('/access-community');

  };

});

app.controller('AccessCommunityCtrl', function($scope, $location){

  $scope.goBack = function(){
    $location.path('/store-auth');
    $location.replace();
  };

});

app.factory('SicomFactory', ['$http', function($http){

  var headerConfig = {
    headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, OPTIONS, HEAD'}
  };

  return{
    getStoreCode: function(storeId){
      console.log('Inside factory store id', storeId);
        var config = {
          params: {
            'storeId': storeId
          }
        }
        return $http.get('https://sicom-services.herokuapp.com/api/sicom/store', config, headerConfig)
              .then(function(successPayload){
                console.info('Success - ', successPayload);
                return successPayload.data;
              }, function(errorPayload){
                console.error('Error - ', successPayload);
              });

    }
  };


}]);

app.service('SicomService', function(){

  var storeCode = "Code not received";
  return {
    getstoreCode: function(){
      return storeCode;
    },
    setstoreCode: function(value){
      storeCode = value;
    }
  };

});
