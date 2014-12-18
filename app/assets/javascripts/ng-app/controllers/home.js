angular.module('YeaNayers')
  .controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
    
    $scope.searchBills = function() {

      $scope.billForm.query;

      var govTrackUrl = 'https://www.govtrack.us/api/v2/bill' +
      '?q=' + $scope.billForm.query + '&congress=113&order_by=-current_status_date&limit=600';
      $http.get(govTrackUrl).success(function(data) {
        $scope.bills = data.objects;
        console.log('bills.length: ' + $scope.bills.length);
      });
    };

    $scope.findVoteRollCall = function(bill) {
      // 256160
      var govTrackUrl2 = 'https://www.govtrack.us/api/v2/vote?related_bill=' + bill.id
      $http.get(govTrackUrl2).success(function(data) {
        $scope.voteRollCall = data.objects;
        console.log('voteRollCall.length: ' + $scope.voteRollCall.length);
      });

      var govTrackUrl3 = 'https://www.govtrack.us/api/v2/vote_voter?vote=' + '116058' +
      '&limit=450'
      $http.get(govTrackUrl3).success(function(data) {
        $scope.voteByMember = data.objects;
        console.log('voteByMember.length: ' + $scope.voteByMember.length);
      });

      bill.voteInfo = true;
    };
  }]);