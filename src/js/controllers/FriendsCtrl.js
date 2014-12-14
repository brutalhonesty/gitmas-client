myApp.controller('FriendsCtrl', 
	['$scope', 'Friends', '$http', '$state', '$timeout', 
	function($scope, Friends, $http, $state, $timeout, auth) {

		$scope.profile = JSON.parse(localStorage.getItem("profile"));

		console.log('profile: ', $scope.profile);

		var repos = $scope.profile.public_repos;
		var gists = $scope.profile.public_gists;
		var following = $scope.profile.following;
		var followers = $scope.profile.followers;

		console.log('dat dat :', repos, gists, followers, following);
  

  		$scope.config = {
		    title: '',
		    tooltips: true,
		    labels: false,
		    mouseover: function() {},
		    mouseout: function() {},
		    click: function() {},
		    legend: {
		      display: false,
		      //could be 'left, right'
		      position: 'right'
		    }
		  };

  $scope.data = {
    //series: ['WordCount'],
    data: [{
      x: "Gists",
      y: [gists],
      tooltip: "this is tooltip"
    },{
      x: "Repos",
      y: [repos],
      tooltip: "this is tooltip"
    },{
      x: "Followers",
      y: [followers],
      tooltip: "this is tooltip"
    },{
      x: "Following",
      y: [following],
      tooltip: "this is tooltip"
    }]
  };

  var myLabel = repos + gists + following + followers;
  console.log('mylabel ', myLabel);
  
  function test(){
  	if(myLabel < 20){
  		return "NAUGHTY!"
  	}
  	else{
  		return "NICE"
  	}
  };
  	$scope.label = test();

  $scope.testsend = function(){
  	$http.post('google.com/testing', {});
  };
}]);