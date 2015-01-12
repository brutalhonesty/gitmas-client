myApp.controller('LoginCtrl', ['store', '$scope', '$location', 'auth', 'Userservice', '$state', '$geolocation', '$stateParams', function (store, $scope, $location, auth, Userservice, $state, $geolocation, $stateParams) {
  function login() {
    auth.signin({
      authParams: {
        scope: 'openid offline_access',
        device: 'Mobile device'
      }
    }, function(profile, token, accessToken, state, refreshToken) {
      store.set('profile', profile);
      store.set('token', token);
      store.set('refreshToken', refreshToken);
      $geolocation.getCurrentPosition({
        timeout: 60000
      }).then(function (data) {
        var loginData = {
          authToken: profile.identities[0].access_token,
          location: {
            latitude: data.coords.latitude,
            longitude: data.coords.longitude
          }
        };
        Userservice.login(loginData).success(function (loginResp) {
          store.set('queueId', loginResp.id);
          $state.transitionTo('tab.graph', null, {'reload':true});
        }).error(function (error, statusCode) {
          console.error('Error loggin user in!', error);
        });
      });
    }, function (error) {
     console.error('Error loggin user in!', error);
    });
  }
  $scope.login = function () {
    login();
  };
}]);