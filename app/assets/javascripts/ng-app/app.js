angular
    .module('YeaNayers', [
        'ngRoute',
        'templates'
    ]).config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'home.html',
                controller: 'HomeCtrl'
            });
        // enable HTML5 Mode for SEO
        // $locationProvider.html5Mode(true);
    });