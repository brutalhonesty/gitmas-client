myApp.controller('DashCtrl', ['$scope', '$state', 'Friends', function($scope, $state, Friends) {

	//$state.go('tab.nnlist');
	var loggedIn = Friends.user();
  	
	if(!loggedIn){
		$state.go('tab.login');
	}


}]);