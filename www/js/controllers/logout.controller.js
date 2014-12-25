myApp.controller('LogoutCtrl', ['$log', '$scope', 'auth', 'store', 'socket', function ($log, $scope, auth, store, socket) {
  //automatic logout
  $log.log('User Logged Out!');
  auth.signout();
  socket.disconnect();
  store.remove('profile');
  store.remove('token');
  $scope.auth = auth;
}]);