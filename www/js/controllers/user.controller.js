myApp.controller('UserCtrl', ['$scope', 'store', '$state', 'Fireuser', function ($scope, store, $state, Fireuser) {
  var username = store.get('profile').nickname;
  Fireuser(username).$bindTo($scope, 'user');
}]);