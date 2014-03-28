var whisperApp = angular.module('whisperApp',['ngRoute']);

whisperApp.controller('LoginCtrl', ['$scope','$http','$window',function ($scope, $http, $window) {
  $scope.user = {};
  $scope.message = '';
  $scope.submit = function () {
    $http
      .post('/api/user/login', $scope.user)
      .success(function (data, status, headers, config) {
        if (data.error){
          delete $window.sessionStorage.token;
          $scope.message = 'Error: Invalid user or password';
          return; 
        }
        $window.sessionStorage.token = data.token;
        $scope.message = 'Welcome';
        $window.location.href = '/home';
      })
      .error(function (data, status, headers, config) {
        delete $window.sessionStorage.token;
        $scope.message = 'Error: Invalid user or password';
      });
  };
}]);

whisperApp.controller('RegisterCtrl', ['$scope','$http','$window',function ($scope, $http, $window) {
  $scope.user = {};
  $scope.message = '';
  $scope.submit = function () {
    $http
      .post('/api/user/create', $scope.user)
      .success(function (data, status, headers, config) {
        if (data.error){
          delete $window.sessionStorage.token;
          $scope.message = 'Error: ' + data.error;  
          return;    
        }
        $window.sessionStorage.token = data.token;
        $scope.message = 'Welcome';
        $window.location.href = '/home';
      })
      .error(function (data, status, headers, config) {
        delete $window.sessionStorage.token;
        $scope.message = 'Error: Invalid user or password';
      });
  };
}]);

whisperApp.controller('BaseCtrl',['$scope',function($scope){
  $scope.show_post = false;
}]);

whisperApp.controller('NewPostCtrl', ['$scope','$http','$window',function ($scope, $http, $window) {
  $scope.post = {};
  $scope.message = '';


  $scope.submit = function () {
    $http
      .post('/api/post/create', $scope.post)
      .success(function (data, status, headers, config) {
        $scope.post = {};
        $scope.message = 'Posted';
      })
      .error(function (data, status, headers, config) {
        $scope.message = 'Error.';
      });
  };
}]);

whisperApp.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});

whisperApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});