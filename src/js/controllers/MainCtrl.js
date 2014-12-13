myApp.controller('MainCtrl', ['$scope', '$log',  function($scope, $log) {

	$scope.logout = function(){
		//Log out logic will go here
		$log.log('User Logout Clicked!');
		$state.go('tab.dash');
	};

}]);