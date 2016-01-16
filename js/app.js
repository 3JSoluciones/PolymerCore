angular.module('app', ['ui.router', 'ngMaterial'])

  .config(function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/home.html',
            controller: ''
        })
        .state('about', {
            url: '/about',
            templateUrl: 'statics/about.html',
            controller: 'AboutController'
        })
  })

    .controller('BaseController', function($scope, $window, $q, $http, cafeApi, fakeData){
        var baseUrl = 'http://182.168.1.34:8000/api/';

        // Aromas
        $scope.buscaAroma = 0;
        $scope.aromas = {};

        cafeApi.getAromas().success(function(data) {
          $scope.aromas = data;
        }).error(function(data){
          $scope.aromas = 'Error Loading';
        });

        // Productores
        $scope.productores = [];
        for (var i = 0; i < 5; i++) {
            fakeData.user().success(function(data){
                $scope.productores.push(data.results[0].user);

            });
        }








    })



    .controller('AboutController', function($scope){

})

.service('cafeApi', function($http){

    this.getAromas = function() {
      return $http({method: 'jsonp', url: 'http://192.168.1.34:8080/api/aromas?callback=JSON_CALLBACK'})
    };

})


.service('fakeData', function($http){

    this.user = function() {
        return $http({method: 'get', dataType:'json', url: 'https://randomuser.me/api/'})
    }

});
