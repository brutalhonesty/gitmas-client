myApp.controller('FriendsCtrl', ['$scope', 'Friends', '$http', '$state', '$timeout', function($scope, Friends, $http, $state, $timeout) {
  

  
  	
  		//
  	

  $scope.testsend = function(){
  	$http.post('google.com/testing', {});
  };
}]);