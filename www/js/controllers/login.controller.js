myApp.controller('LoginCtrl', ['store', '$scope', '$location', 'auth', 'Userservice', '$state', '$geolocation', function (store, $scope, $location, auth, Userservice, $state, $geolocation) {
  function login() {
    auth.signin({
      authParams: {
        scope: 'openid offline_access',
        device: 'Mobile device'
      }
    }, function(profile, token, accessToken, state, refreshToken) {
      console.log('user data: ', profile);
      console.log('token: ' + token);
      console.log('refreshToken: ' + refreshToken);
      store.set('profile', profile);
      store.set('token', token);
      store.set('refreshToken', refreshToken);
      $geolocation.getCurrentPosition({
        timeout: 60000
      }).then(function (data) {
        $scope.location = data.coords;
        var loginData = {
          username: profile.nickname,
          authToken: profile.identities[0].access_token,
          location: {
            latitude: $scope.location.latitude,
            longitude: $scope.location.longitude
          }
        };
        Userservice.login(loginData).success(function (loginResp) {
          $state.go('tab.graph');
          console.log(loginResp);
          store.set('queueId', loginResp.id);
        }).error(function (error, statusCode) {
          console.error('Error loggin user in!', error);
        });
      });
    }, function (error) {
     console.error('Error loggin user in!', error);
    });
  }
  login();
  $scope.login = function () {
    login();
  };
}]);