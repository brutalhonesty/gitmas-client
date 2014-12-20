myApp.controller('LogoutCtrl', ['$log', '$scope', 'auth', 'store', function ($log, $scope, auth, store) {
  //automatic logout
  $log.log('User Logged Out!');
  auth.signout();
  store.remove('profile');
  store.remove('token');
  $scope.auth = auth;
}]);