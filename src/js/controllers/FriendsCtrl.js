myApp.controller('FriendsCtrl', ['$scope', 'Friends', function($scope, Friends) {
  $scope.friends = Friends.all();
}]);