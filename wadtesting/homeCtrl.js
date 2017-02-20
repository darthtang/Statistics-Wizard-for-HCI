angular
  .module('app')
  .controller('homeCtrl', ['$scope', function($scope) {
          
    $scope.checkAuth1 = function() {
      alert('1');
      checkAuth1();
    };
        $scope.pairedTtestRun = function() {
      alert('2');
      pairedTtestRun();
    };
      $scope.repeatedAnovaRun = function() {
      alert('3');
      repeatedAnovaRun();
    };
  }]);