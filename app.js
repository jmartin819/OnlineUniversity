// name our angular app
angular.module('mainApp', [ 
  'ngRoutes', 
  'ngResource',
  'ngAnimate'
  ])

.config(function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);
    
    $routeProvider

        .when('/', {
            templateUrl: '/public/html/index.html',
            controller : 'mainController',
            controllerAs : 'main'
        })

        .otherwise({
            redirectTo: '/404'
        });
    
});

.config(['$resourceProvider', function($resourceProvider){
  $resourceProvider.defaults.stripTrailingSlashes = false;
}])

//new user controller
.controller('mainController', function(){
  var vm = this;
});