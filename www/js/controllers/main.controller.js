myApp.controller('MainCtrl', ['$scope', '$log', function($scope, $log) {
  $scope.logout = function(){
    $log.log('User Logout Clicked!');
    $state.go('tab.dash');
  };
}]);