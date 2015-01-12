myApp.controller('LogoutCtrl', ['$log', '$scope', 'auth', 'store', 'socket', '$state', function ($log, $scope, auth, store, socket, $state) {
  //automatic logout
  $log.log('User Logged Out!');
  auth.signout();
  socket.disconnect();
  store.remove('profile');
  store.remove('token');
  $scope.auth = auth;
  $state.go('login', {}, {relative: false});
}]);