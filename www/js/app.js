var myApp = angular.module('gitmas', ['ionic', 'auth0', 'angular-storage', 'angular-jwt', 'ngGeolocation', 'btford.socket-io', 'firebase'])
.config(['$stateProvider', '$urlRouterProvider', 'authProvider', '$httpProvider', 'jwtInterceptorProvider',
  function($stateProvider, $urlRouterProvider, authProvider, $httpProvider, jwtInterceptorProvider) {

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/tab-login.html',
      controller: 'LoginCtrl'
    })
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html',
      controller: 'MainCtrl'
    })
    .state('tab.graph', {
      url: '/graph',
      views: {
        'tab-graph': {
          templateUrl: 'templates/tab-graph.html',
          controller: 'GraphCtrl'
        }
      },
      data: {
        requiresLogin: true
      }
    })
    .state('tab.logout', {
      url: '/logout',
      views: {
        'tab-logout': {
          templateUrl: 'templates/tab-logout.html',
          controller: 'LogoutCtrl'
        }
      }
    });

    $urlRouterProvider.otherwise('/tab/graph');

    authProvider.init({
      domain: 'gitmas.auth0.com',
      clientID: 'v4LuQtSTmlkqXvGpGsWEAZREJzl5yed7',
      loginState: 'login'
    });

    jwtInterceptorProvider.tokenGetter = function(store, jwtHelper, auth) {
      var idToken = store.get('token');
      var refreshToken = store.get('refreshToken');
      // If no token return null
      if (!idToken || !refreshToken) {
        return null;
      }
      // If token is expired, get a new one
      if (jwtHelper.isTokenExpired(idToken)) {
        return auth.refreshIdToken(refreshToken).then(function(idToken) {
          store.set('token', idToken);
          return idToken;
        });
      } else {
        return idToken;
      }
    };

    $httpProvider.interceptors.push('jwtInterceptor');
}]).run(['$ionicPlatform', 'auth', '$rootScope', 'store', 'jwtHelper', '$state', function ($ionicPlatform, auth, $rootScope, store, jwtHelper, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  auth.hookEvents();
  $rootScope.$on('$locationChangeStart', function (event) {
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          auth.authenticate(store.get('profile'), token);
        } else {
          // Either show Login page or use the refresh token to get a new idToken
          $state.go('login');
        }
      }
    }
  });
}]).value('FIRE_URL', 'https://sizzling-inferno-2672.firebaseio.com');
