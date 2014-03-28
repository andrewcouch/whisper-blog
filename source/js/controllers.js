var crafterApp = angular.module('crafterApp',['ngRoute']);

crafterApp.controller('LoginCtrl', ['$scope','$http','$window',function ($scope, $http, $window) {
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
        $window.location.href = '/account';
      })
      .error(function (data, status, headers, config) {
        delete $window.sessionStorage.token;
        $scope.message = 'Error: Invalid user or password';
      });
  };
}]);

crafterApp.controller('RegisterCtrl', ['$scope','$http','$window',function ($scope, $http, $window) {
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
        $window.location.href = '/account';
      })
      .error(function (data, status, headers, config) {
        delete $window.sessionStorage.token;
        $scope.message = 'Error: Invalid user or password';
      });
  };
}]);
crafterApp.controller('UpdateCtrl', ['$scope','$http','$window',function ($scope, $http, $window) {
  $scope.user = {};
  $scope.message = '';

  $http.get('/api/viewaccount').success(function(data) {
      $scope.user = data;
    });

  $scope.submit = function () {
    $http
      .post('/api/updateaccount', $scope.user)
      .success(function (data, status, headers, config) {
        $scope.user = data;
        $scope.message = 'Updated';
      })
      .error(function (data, status, headers, config) {
        $scope.message = 'Error: Invalid user or password';
      });
  };
}]);
crafterApp.factory('authInterceptor', function ($rootScope, $q, $window) {
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

crafterApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});