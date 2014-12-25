'use strict';
myApp.factory('socket', ['$rootScope', function ($rootScope) {
  var socket = io.connect('http://192.168.1.100:9000');
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        });
      },
      emit: function(eventName, data, callback) {
        socket.emit(eventName, data, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            if(callback) {
              callback.apply(socket, args);
            }
          });
        });
      },
      disconnect: function(callback) {
        socket.disconnect();
      }
    };
}]);