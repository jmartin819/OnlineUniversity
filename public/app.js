// name our angular app
angular.module('mainApp', [
  'ngResource',
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap'
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

.factory('courseFactory', function($http, $resource){
  var localCourseFactory = {};

  // get all courses
  localCourseFactory.all = function(){
    return $http.get('/api/course');
  };

  //create new course
  localCourseFactory.create = function(courseData){
    return $http.post('/api/course', courseData);
  };

  localCourseFactory.removeCourse = function(id){
    return $http.delete('/api/course/' + id);
  }

  return localCourseFactory;
})

.controller('mainController', function(courseFactory, $scope, $modal, $log){
  var vm = this;

  vm.items = ['item1', 'item2', 'item3'];

  courseFactory.all()
  .success(function(data){
    vm.courses = data;
  });

  vm.removeCourse = function(course){
    console.log(course);
    courseFactory.removeCourse(course._id)
    .success(function(){
      console.log("Deleted course.");
    });

    courseFactory.all()
    .success(function(data){
      vm.courses = data;
    });
  }

  vm.addCourse = function(){
    console.log("Add Course.");

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'modalInstanceCtrl',
      size: 'lg',
      resolve: {
        courses: function () {
          return $scope.courses;
        }
      }
    });

    modalInstance.result.then(function (){
      $scope.selected = "Message here";
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }

  vm.editCourse = function(course){
    console.log("Edit Course " + course.name);
  }

})

.controller('modalInstanceCtrl', function($scope, $modalInstance){

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});