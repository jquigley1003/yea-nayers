angular.module('YeaNayers', [
	'ngAnimate',
	'ui.router',
	'templates'
])
.config(['$stateProvider', '$urlRouterProvider', 
	function($stateProvider, $urlRouterProvider) {
	/**
	 * Routes and States
	 */
	$stateProvider
		.state('home', {
			url: '',
			templateUrl: 'home.html',
			controller: 'HomeCtrl'
		})

		.state('bill_detail', {
			url: '/bill_detail',
			templateUrl: 'bill_detail.html',
			controller: 'BillDetailCtrl'
		});

	// default fall back route
	$urlRouterProvider.otherwise('/');

	// enable HTML5 Mode for SEO
	// $locationProvider.html5Mode({
	//     enabled: true,
	//     requireBase: false
	// });
}]);