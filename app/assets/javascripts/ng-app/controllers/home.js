angular.module('YeaNayers')
  .controller('HomeCtrl', ['$scope', '$http', 'voteService', function($scope, $http, voteService) {

    var homeCtrl = this
    $scope.searchBills = function() {

      $scope.billForm.query;
      $scope.congressForm.query;

      var govTrackUrl = 'https://www.govtrack.us/api/v2/bill' +
      '?q=' + $scope.billForm.query + '&congress=' + $scope.congressForm.query + '&order_by=-current_status_date&limit=600';
      $http.get(govTrackUrl).success(function(data) {
        $scope.bills = data.objects;
        console.log('bills.length: ' + $scope.bills.length);
      });
    };

    homeCtrl.findVoteRollCall = voteService.findVoteRollCall;

    homeCtrl.showVotes = voteService;
    homeCtrl.houseVote = voteService;
    homeCtrl.senateVote = voteService;
    homeCtrl.voteInfo = voteService;
    homeCtrl.noHouseVote = voteService;
    homeCtrl.noSenateVote = voteService;
  }]);