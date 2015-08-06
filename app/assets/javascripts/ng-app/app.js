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
			url: '/',
			templateUrl: 'home.html',
			controller: 'HomeCtrl as homeCtrl'
		})

		.state('about', {
			url: '/about',
			templateUrl: 'about.html',
			controller: 'AboutCtrl'
		});

	// default fall back route
	$urlRouterProvider.otherwise('/');

	// enable HTML5 Mode for SEO
	// $locationProvider.html5Mode({
	//     enabled: true,
	//     requireBase: false
	// });
  }])
  .run(['$state', function($state) {
    $state.go('home'); //make a transition to home state when app starts
}]);