'use strict';
myApp.factory('Fireuser', ['$firebase', 'FIRE_URL', function ($firebase, FIRE_URL) {
  return function (username) {
    var ref = new Firebase(FIRE_URL + '/ranks').child(username);
    return $firebase(ref).$asObject();
  };
}]);