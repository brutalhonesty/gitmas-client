myApp.controller('FriendDetailCtrl', ['$scope', '$stateParams', 'Friends', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
}]);