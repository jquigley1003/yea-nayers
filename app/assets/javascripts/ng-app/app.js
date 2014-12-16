angular.module('YeaNayers', [
        'ngRoute',
        'templates'
])
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'home.html',
                controller: 'HomeCtrl'
            });
        // enable HTML5 Mode for SEO
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
}]);