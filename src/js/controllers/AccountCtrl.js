myApp.controller('AccountCtrl', ['$scope', '$state', '$log', '$location', function($scope, $state, $log, $location) {

	//automatic logout
	$log.log('User Logged Out!');
	$location.path('https://gitmas.auth0.com/logout?returnTo=http://localhost:8100');

}]);