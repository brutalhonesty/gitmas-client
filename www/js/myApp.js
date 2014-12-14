var myApp = angular.module('starter', [
  'ionic',
  'auth0',
  'angular-storage',
  'angular-jwt',
  'angularCharts'])

.run(function($ionicPlatform, auth, $rootScope, store, jwtHelper, $location) {
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

  $rootScope.$on('$locationChangeStart', function() {
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          auth.authenticate(store.get('profile'), token);
        } else {
          // Either show Login page or use the refresh token to get a new idToken
          $location.path('/');
        }
      }
    }
  });

})

.config(function($stateProvider, $urlRouterProvider, authProvider, $httpProvider, jwtInterceptorProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  authProvider.init({
    domain: 'gitmas.auth0.com',
    clientID: 'v4LuQtSTmlkqXvGpGsWEAZREJzl5yed7',
    loginState: 'tab.login'
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

  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html",
      controller: 'MainCtrl'
    })

    // Each tab has its own nav history stack:

      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
          }
        },
        data: {
          requiresLogin: true
        }
      })

        .state('tab.nnlist', {
          url: '/nnlist',
          views: {
            'tab-nnlist': {
              templateUrl: 'templates/tab-dash-nnlist.html',
              controller: 'FriendsCtrl'
            }
          },
          data: {
            requiresLogin: true
          }
        })

      .state('tab.login', {
        url: '/login',
        views: {
          'tab-login': {
            templateUrl: 'templates/tab-login.html',
            controller: 'LoginCtrl'
          }
        }
      })


    .state('tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })
    .state('tab.friend-detail', {
      url: '/friend/:friendId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});


myApp.controller('AccountCtrl', ['$scope', '$state', '$log', '$location', function($scope, $state, $log, $location) {

	//automatic logout
	$log.log('User Logged Out!');
	$location.path('https://gitmas.auth0.com/logout?returnTo=http://localhost:8100');

}]);
myApp.controller('DashCtrl', ['$scope', '$state', 'Friends', function($scope, $state, Friends) {



}]);
myApp.controller('FriendDetailCtrl', ['$scope', '$stateParams', 'Friends', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
}]);
myApp.controller('FriendsCtrl', 
	['$scope', 'Friends', '$http', '$state', '$timeout', 
	function($scope, Friends, $http, $state, $timeout, auth) {

		$scope.profile = JSON.parse(localStorage.getItem("profile"));

		console.log('profile: ', $scope.profile);

		var repos = $scope.profile.public_repos;
		var gists = $scope.profile.public_gists;
		var following = $scope.profile.following;
		var followers = $scope.profile.followers;

		console.log('dat dat :', repos, gists, followers, following);
  

  		$scope.config = {
		    title: '',
		    tooltips: true,
		    labels: false,
		    mouseover: function() {},
		    mouseout: function() {},
		    click: function() {},
		    legend: {
		      display: false,
		      //could be 'left, right'
		      position: 'right'
		    }
		  };

  $scope.data = {
    //series: ['WordCount'],
    data: [{
      x: "Gists",
      y: [gists],
      tooltip: "this is tooltip"
    },{
      x: "Repos",
      y: [repos],
      tooltip: "this is tooltip"
    },{
      x: "Followers",
      y: [followers],
      tooltip: "this is tooltip"
    },{
      x: "Following",
      y: [following],
      tooltip: "this is tooltip"
    }]
  };

  var myLabel = repos + gists + following + followers;
  console.log('mylabel ', myLabel);
  
  function test(){
  	if(myLabel < 20){
  		return "NAUGHTY!"
  	}
  	else{
  		return "NICE"
  	}
  };
  	$scope.label = test();

  $scope.testsend = function(){
  	$http.post('google.com/testing', {});
  };
}]);
myApp.controller('LoginCtrl', function(store, $scope, $location, auth, $http, $state) {


	//login ctrl
	
  function login() {
    auth.signin({
      authParams: {
        scope: 'openid offline_access',
        device: 'Mobile device'
      }
    }, function(profile, token, accessToken, state, refreshToken) {
    	console.log('user data: ', profile);
      $http.post('/api/user/login', { username : profile.nickname, authToken : accessToken });
      console.log('User logged in! ', localStorage.getItem('signedIn'));
      store.set('profile', profile);
      store.set('token', token);
      store.set('refreshToken', refreshToken);
      //$http.post()
      $state.go('tab.nnlist');

    }, function(error) {
      // Error callback
     console.error('Error loggin user in!', error);
    });
  }

  login();




});
myApp.controller('MainCtrl', ['$scope', '$log', 'Friends', function($scope, $log, Friends) {

	$scope.logout = function(){
		//Log out logic will go here
		$log.log('User Logout Clicked!');
		$state.go('tab.dash');
	};

	//check if users logged in
	

}]);
myApp.factory('Friends', ['$rootScope', function($rootScope) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  var user = function(){
    return localStorage.getItem('singedIn');
  };

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    },
    user : user
  };
}]);