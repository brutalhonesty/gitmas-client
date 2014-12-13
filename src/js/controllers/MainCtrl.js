myApp.controller('MainCtrl', ['$scope', '$log', 'Friends', function($scope, $log, Friends) {

	$scope.logout = function(){
		//Log out logic will go here
		$log.log('User Logout Clicked!');
		$state.go('tab.dash');
	};

	//check if users logged in
	

}]);