myApp.controller('AccountCtrl', ['$scope', '$state', '$log', function($scope, $state, $log) {

	//automatic logout
	$log.log('User Logged Out!');
	$state.go('tab.dash');

}]);