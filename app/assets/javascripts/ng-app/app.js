angular.module('YeaNayers', [
    'ngAnimate',
    'ui.router'
])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 
    function($stateProvider, $urlRouterProvider, $locationProvider) {
    /**
     * Routes and States
     */
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'home.html',
            controller: 'HomeCtrl'
        });

    // default fall back route
    // $urlRouterProvider.otherwise('/');

    // enable HTML5 Mode for SEO
    // $locationProvider.html5Mode({
    //     enabled: true,
    //     requireBase: false
    // });
}]);