// name our angular app
angular.module('mainApp', [
  'ngResource',
  'ngRoute',
  'ngAnimate'
  ])

.config(['$resourceProvider', function($resourceProvider){
  $resourceProvider.defaults.stripTrailingSlashes = false;
}])

.config(function($routeProvider, $locationProvider){
  $locationProvider.html5Mode(true);

  $routeProvider

    .when('/',{
      templateURL: './html/profile.html',
      controller: 'mainController'
    })
})

//new user controller
.controller('mainController', function(){
  var vm = this;

  console.log("Using main controller");

});