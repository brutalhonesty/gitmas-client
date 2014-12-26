'use strict';
myApp.factory('Fireranks', ['$firebase', 'FIRE_URL', function ($firebase, FIRE_URL) {
  return function () {
    var ref = new Firebase(FIRE_URL).child('ranks').orderByChild('percentage');
    return $firebase(ref).$asArray();
  };
}]);