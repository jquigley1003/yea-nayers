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

    function getVote(chamber, voteRollCall) {
      return _.find(voteRollCall, function(vote) {
        return vote.chamber === chamber && vote.category === 'passage';
      })
    }

    $scope.findVoteRollCall = function(bill) {
      // 256160
      var govTrackUrl2 = 'https://www.govtrack.us/api/v2/vote?related_bill=' + bill.id
      $http.get(govTrackUrl2).success(function(data) {
        var voteRollCall = data.objects;
        console.log('voteRollCall.length: ' + voteRollCall.length);

        var congressionalVote = getVote('house',  voteRollCall);
        var congressionalVoteId = congressionalVote.options[0].vote;
        console.log('congressionalVote = ' + congressionalVoteId + ' // should be 116058');
        var senateVote = getVote('senate', voteRollCall);
        var senateVoteId = senateVote.options[0].vote;
        console.log('senateVote = ' + senateVoteId + ' // should be 116091');
        
        var govTrackUrl3 = 'https://www.govtrack.us/api/v2/vote_voter?vote=' + 
          congressionalVoteId + '&limit=450';
        $http.get(govTrackUrl3).success(function(data) {
          $scope.congressionalVoteByMember = data.objects;
          console.log('congressionalVoteByMember.length: ' + $scope.congressionalVoteByMember.length);
          
        });

        var govTrackUrl4 = 'https://www.govtrack.us/api/v2/vote_voter?vote=' + 
          senateVoteId + '&limit=450';
        $http.get(govTrackUrl4).success(function(data) {
          $scope.senateVoteByMember = data.objects;
          console.log('senateVoteByMember.length: ' + $scope.senateVoteByMember.length);
        });
      });

      bill.voteInfo = true;
    };
  }]);