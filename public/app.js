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

//new user controller
.controller('mainController', function(courseFactory){
  var vm = this;

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
      templateURL: 'modal.html',
      controller: 'modalInstanceCtrl',
      size: 'lg',
      resolve: {
        courses: function () {
          return $scope.courses;
        }
      }
    });

    modalInstance.result.then(function (selectedItem))
  }

  vm.editCourse = function(course){
    console.log("Edit Course " + course.name);
  }

});