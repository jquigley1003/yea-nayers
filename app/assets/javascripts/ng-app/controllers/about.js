angular.module('YeaNayers')
  .controller('AboutCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.searchBills = function(billId) {

      var govTrackUrl = 'https://www.govtrack.us/api/v2/vote?' +
      'related_bill=' + billId
      $http.get(govTrackUrl).success(function(data) {
        $scope.voteRollCall = data.objects;
        console.log('voteRollCall.length: ' + $scope.voteRollCall.length);
      });
    };
  }]);