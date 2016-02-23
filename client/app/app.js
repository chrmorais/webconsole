'use strict';

angular.module('meccanoAdminApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'chart.js'
  ])
  .run(
    ['$rootScope', '$state', '$stateParams',
      function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      }
    ]
  )
  .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');


    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor','alertInterceptor');

  })

.factory('authInterceptor', function($rootScope, $q, $cookieStore, $location) {
  return {
    // Add authorization token to headers
    request: function(config) {
      config.headers = config.headers || {};
      if ($cookieStore.get('token')) {
        config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
      }
      return config;
    },

    // Intercept 401s and redirect you to login
    responseError: function(response) {
      if (response.status === 401) {
        $location.path('/login');
        // remove any stale tokens
        $cookieStore.remove('token');
        return $q.reject(response);
      } else {
        return $q.reject(response);
      }
    }
  };
})
.factory('alertInterceptor', function($rootScope, $q, $location,alertsPanel) {
  return {
    responseError: function(response) {
      if (response.status === 403) {
        alertsPanel.addWarning('You are not authorized to performing this action.');
        return $q.reject(response);
      }else if (response.status === 500) {
        alertsPanel.addError('The server return an error.');
        return $q.reject(response);
      } else if (response.status === -1) {
        alertsPanel.addError('The server is inaccessible, please check your connection.');
        return $q.reject(response);
      }else {
        return $q.reject(response);
      }
    }
  };
})
.run(function($rootScope, $location, Auth) {
  // Redirect to login if route requires auth and you're not logged in
  $rootScope.$on('$stateChangeStart', function(event, next) {
    Auth.isLoggedInAsync(function(loggedIn) {
      if (next.authenticate && !loggedIn) {
        $location.path('/login');
      }
    });
  });
});
