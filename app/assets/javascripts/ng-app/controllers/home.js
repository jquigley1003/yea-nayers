angular.module('YeaNayers')
  .controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.things = ['Angular', 'Rails 4.1', 'UI Router', 'Together!!'];
    

 
      var govTrackUrl = 'https://www.govtrack.us/api/v2/bill?q=gun%20control&congress=113&order_by=-current_status_date';
      $http.get(govTrackUrl).success(function(data){
      $scope.bills = data;
      });

  }]);