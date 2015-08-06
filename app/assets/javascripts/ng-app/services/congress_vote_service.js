angular.module('YeaNayers')
  .service('voteService',['$http', function VoteService($http) {
    
    var votesOnBill = this;

    function getVote(chamber, voteRollCall) {
      passageSuspension = _.find(voteRollCall, { 'chamber': chamber, 'category': 'passage_suspension'});
      if (passageSuspension) {
        return _.find(voteRollCall, function(vote) {
          return vote.chamber === chamber && vote.category === 'passage_suspension';
        })
      }
      else {
        return _.find(voteRollCall, function(vote) {
          return vote.chamber === chamber && vote.category === 'passage';
        })        
      }
    }

    votesOnBill.findVoteRollCall = function(bill) {

      bill.voteInfo = false;
      bill.noVoteInfo = true;
      bill.yesSenateVote = false;
      bill.yesHouseVote = false;
      bill.noSenateVote = true;
      bill.noHouseVote = true;    
      votesOnBill.showVoteInfo = true;
      votesOnBill.showVotes = false;
      votesOnBill.houseVoteByMember = null;
      votesOnBill.senateVoteByMember = null;

// Find the voting results for a specific bill

      var govTrackUrl2 = 'https://www.govtrack.us/api/v2/vote?related_bill=' + bill.id
      $http.get(govTrackUrl2).success(function(data) {

        bill.voteInfo = true;
        bill.noVoteInfo = false;

        var voteRollCall = data.objects;

        console.log('voteRollCall.length: ' + voteRollCall.length);

// Check for any House votes for this specific bill

        var houseVote = getVote('house',  voteRollCall);

        if (houseVote) {

          bill.yesHouseVote = true;
          bill.noHouseVote = false;
          votesOnBill.showVotes = true;

          var houseVoteId = houseVote.options[0].vote;
          console.log('houseVote = ' + houseVoteId + ' // should be 116058');

          var govTrackUrl3 = 'https://www.govtrack.us/api/v2/vote_voter?vote=' + 
            houseVoteId + '&limit=450';
          $http.get(govTrackUrl3).success(function(data) {
            votesOnBill.houseVoteByMember = data.objects;
            console.log('votesOnBill.houseVoteByMember.length: ' + votesOnBill.houseVoteByMember.length);         
          });

        }

// Check for any Senate votes for this specific bill

        var senateVote = getVote('senate', voteRollCall);

        if (senateVote) {

          bill.yesSenateVote = true;
          bill.noSenateVote = false;
          votesOnBill.showVotes = true;

          var senateVoteId = senateVote.options[0].vote;
          console.log('senateVote = ' + senateVoteId + ' // should be 116091');

          var govTrackUrl4 = 'https://www.govtrack.us/api/v2/vote_voter?vote=' + 
            senateVoteId + '&limit=450';
          $http.get(govTrackUrl4).success(function(data) {
            votesOnBill.senateVoteByMember = data.objects;
            console.log('votesOnBill.senateVoteByMember.length: ' + votesOnBill.senateVoteByMember.length);
          });        
        }
      });
    };
  }]);