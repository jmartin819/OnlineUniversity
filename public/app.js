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
  };

  localCourseFactory.editCourse = function(courseData){
    return $http.put('/api/course/' + courseData._id, courseData);
  }

  return localCourseFactory;
})

.controller('mainController', function(courseFactory, $scope, $modal, $log){
  var vm = this;

  vm.tempCourse = {name : ""};

  courseFactory.all()
  .success(function(data){
    vm.courses = data;
  });

  vm.removeCourse = function(course){
    console.log(course);
    var check = window.confirm("Are you sure you want to delete?");
    if (check == true) {
      courseFactory.removeCourse(course._id)
      .success(function(){
        console.log("Deleted course.");
      });

      courseFactory.all()
      .success(function(data){
        vm.courses = data;
      });
    }
  }

  vm.addCourse = function(){
    console.log("Add Course.");
    vm.tempCourse = {name: "", category: "", dateCreated: "", description: ""};

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'modalInstanceCtrl',
      size: 'lg',
      resolve: {
        tempCourse: function () {
          return vm.tempCourse;
        }
      }
    });

    modalInstance.result.then(function (tempCourse){
      vm.tempCourse.name = tempCourse.name;
      vm.tempCourse.category = tempCourse.category;
      vm.tempCourse.dateCreated = tempCourse.dateCreated;
      vm.tempCourse.description = tempCourse.description;
      console.log(vm.tempCourse);

      courseFactory.create(vm.tempCourse)
      .success(function(){
        console.log("Added course.");
      });

      courseFactory.all()
      .success(function(data){
        vm.courses = data;
      });
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }

  vm.editCourse = function(course){
    console.log("Edit Course " + course.name);
    vm.tempCourse = {_id: course._id, name: course.name, category: course.category, dateCreated: course.dateCreated, description: course.description};

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'modalInstanceCtrl',
      size: 'lg',
      resolve: {
        tempCourse: function () {
          return vm.tempCourse;
        }
      }
    });

    modalInstance.result.then(function (tempCourse){
      vm.tempCourse.name = tempCourse.name;
      vm.tempCourse.category = tempCourse.category;
      vm.tempCourse.dateCreated = tempCourse.dateCreated;
      vm.tempCourse.description = tempCourse.description;
      console.log(vm.tempCourse);

      courseFactory.editCourse(vm.tempCourse)
      .success(function(){
        console.log("Added course.");
      });

      courseFactory.all()
      .success(function(data){
        vm.courses = data;
      });
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }

})

.controller('modalInstanceCtrl', function($scope, $modalInstance, tempCourse){

  $scope.tempCourse = tempCourse;

  $scope.ok = function () {
    $modalInstance.close(tempCourse);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});