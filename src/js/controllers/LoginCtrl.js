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