'use strict';

/**
 * @ngdoc overview
 * @name pdfofflineApp
 * @description
 * # pdfofflineApp
 *
 * Main module of the application.
 */
angular
    .module('pdfofflineApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'LocalForageModule'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }).config(function ($compileProvider) {
        // blob: urls have to be explicitly allowed in AngularJS
        // http://stackoverflow.com/questions/15606751/angular-changes-urls-to-unsafe-in-extension-page
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob):/);
    }).run(function ($window, $rootScope) {
        $rootScope.online = (Offline.state === 'up');

        Offline.on('up', function() {
            $rootScope.$apply(function () {
                $rootScope.online = true;
            });
        });

        Offline.on('down', function() {
            $rootScope.$apply(function () {
                $rootScope.online = false;
            });
        });
    });
