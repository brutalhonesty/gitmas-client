myApp.controller('UserCtrl', ['$scope', 'store', '$state', 'Fireuser', '$stateParams', '$ionicLoading', function ($scope, store, $state, Fireuser, $stateParams, $ionicLoading) {
  var username = $stateParams.username || store.get('profile').nickname;
  $scope.username = username;
  $ionicLoading.show({
    template: 'Loading...'
  });
  Fireuser(username).$bindTo($scope, 'user');
  $scope.options = {
    chart: {
      type: 'multiBarHorizontalChart',
      height: 475,
      width: 400,
      margin: {
        top: 15,
        left: 80,
        right: 20
      },
      x: function(d){return d.label;},
      y: function(d){return d.value;},
      showControls: false,
      showLegend: false,
      stacked: false,
      tooltips: false,
      clipEdge: true,
      interactive: true,
      showValues: true,
      transitionDuration: 500,
      xAxis: {
        showMaxMin: false,
        staggerLabels: false,
        orient: "left"
      },
      noData: "Invalid Username",
      yAxis: {
        axisLabel: 'Percentage',
        staggerLabels: false,
        tickFormat: function(d){
            return d3.format(',.2f')(d);
        }
      },
      staggerLabels: false,
      groupSpacing: 0.2,
    }
  };
  Fireuser(username).$loaded().then(function (data) {
    $ionicLoading.hide();
    if (data.badwords === null) {
      $scope.data = [];
    } else {
      $scope.data = [{
        key: 'Bad',
        color: 'red',
        values: [{
          label: 'Bad Words',
          value: data.badwords * 100
        },{
          label: 'Punctuation',
          value: data.grammar.punctuation * 100
        },{
          label: 'Capitalization',
          value: data.grammar.capitalization * 100
        },{
          label: 'Spelling',
          value: data.grammar.spelling * 100
        },{
          label: 'Syntax',
          value: data.syntax * 100
        }]
      }, {
        key: 'Good',
        color: 'Green',
        values: [{
          label: 'Bad Words',
          value: 100 - (data.badwords * 100)
        },{
          label: 'Punctuation',
          value: 100 - (data.grammar.punctuation * 100)
        },{
          label: 'Capitalization',
          value: 100 - (data.grammar.capitalization * 100)
        },{
          label: 'Spelling',
          value: 100 - (data.grammar.spelling * 100)
        },{
          label: 'Syntax',
          value: 100 - (data.syntax * 100)
        }]
      }];
    }
  }).then(function (error) {
    $ionicLoading.hide();
    if(error) {
      console.log(error);
    }
  });
}]);