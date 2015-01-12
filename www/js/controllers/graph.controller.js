myApp.controller('GraphCtrl', ['$scope', '$log', 'store', 'socket', '$state', '$window', 'Fireuserrank', 'Fireranks', '$ionicLoading', 'Userservice', function ($scope, $log, store, socket, $state, $window, Fireuserrank, Fireranks, $ionicLoading, Userservice) {
  var username = store.get('profile').nickname;
  Fireuserrank(username).$bindTo($scope, 'user');
  $scope.ranks = Fireranks();
  $ionicLoading.show({
    template: 'Gathering Data...'
  });
  $scope.ranks.$loaded().then(function (data) {
    $ionicLoading.hide();
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
    $ionicLoading.hide();
    console.log('got an error');
    console.log(data);
    $scope.progress = null;
    socket.disconnect();
  });

  $scope.viewUser = function (username) {
    $state.go('tab.user', {username: username});
  };
  $scope.checkLastRefreshed = function () {
    $scope.lastUpdated = $scope.lastUpdated || null;
    if(!$scope.lastUpdated) {
      $scope.lastUpdated = Date.now();
    }
  };
  $scope.doRefresh = function () {
    console.log(Date.now() - $scope.lastUpdated);
    if(Date.now() - $scope.lastUpdated >= 60000) {
      $scope.lastUpdated = Date.now();
      var profile = store.get('profile');
      var loginData = {
        authToken: profile.identities[0].access_token
      };
      Userservice.login(loginData).success(function (loginResp) {
        store.set('queueId', loginResp.id);
        socket.emit('getProgress', {id: store.get('queueId')});
        $scope.$broadcast('scroll.refreshComplete');
      }).error(function (error, statusCode) {
        console.error('Error loggin user in!', error);
        $scope.$broadcast('scroll.refreshComplete');
      });
    } else {
      $scope.$broadcast('scroll.refreshComplete');
    }
  };
  $scope.notuser = function (username) {
    return function (input) {
      return input.username !== username;
    };
  }
}]);