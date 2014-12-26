myApp.controller('GraphCtrl', ['$scope', '$log', 'store', 'socket', '$state', '$window', 'Fireuserrank', 'Fireranks', function ($scope, $log, store, socket, $state, $window, Fireuserrank, Fireranks) {
  var username = store.get('profile').nickname;
  Fireuserrank(username).$bindTo($scope, 'user');
  $scope.ranks = Fireranks();
  $scope.ranks.$loaded().then(function (data) {
    var usernames = data.map(function (rank) {
      return rank.username;
    });
    $scope.rank = usernames.indexOf(username);
  }).then(function (error) {
    if(error) {
      console.log(error);
    }
  });
  socket.emit('getProgress', {id: store.get('queueId')});
  socket.on('sendProgress', function (data) {
    $scope.progress = data.progress;
    if(data.progress === "100") {
      $scope.progress = null;
      socket.disconnect();
    }
  });
  socket.on('progressError', function (data) {
    console.log('got an error');
    console.log(data);
    $scope.progress = null;
    socket.disconnect();
  });

  $scope.showUser = function () {
    $state.go('tab.graph.user');
  };
}]);