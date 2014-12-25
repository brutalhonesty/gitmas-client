myApp.controller('GraphCtrl', ['$scope', '$log', 'store', 'socket', '$state', '$window', 'Fireuser', 'Fireranks', function ($scope, $log, store, socket, $state, $window, Fireuser, Fireranks) {
  Fireuser(store.get('profile').nickname).$bindTo($scope, 'user');
  $scope.ranks = Fireranks();
  socket.emit('getProgress', {id: store.get('queueId')});
  socket.on('sendProgress', function (data) {
    $scope.progress = data.progress;
    if(data.progress === "100") {
      $scope.progress = null;
      socket.disconnect();
    }
  });
  socket.on('progressError', function (data) {
    console.log('got a message', event.name);
    console.log(data);
    $scope.progress = null;
    socket.disconnect();
  });
}]);