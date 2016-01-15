angular.module('app', ['ui.router'])

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


    .controller('BaseController', function($scope, $window, $q){

        $scope.innerWidth = 0;

        $scope.title = "El Coco";

        $scope.$watch($scope.innerWidth, function () {
            if($scope.innerWidth > 600) {

                $scope.bigScreen = true;
            } else {
                $scope.bigScreen = false;
            }
        })

        var w = angular.element($window);

        $scope.innerWidth = w[0]['innerWidth'];

        w.bind('resize', function(win){
            var defered = $q.defer();
            var promise = defered.promise;
            $scope.innerWidth = win.currentTarget.innerWidth;

        });

        $scope.$watch("innerWidth", function(newval) {
            $scope.list[2].display = newval;
        });





        $scope.aromaId = '';
        $scope.aromas = [
            {'id': '1', 'nombre': 'dulcer'},
            {'id': '2', 'nombre': 'amargo'},

        ]
    })



    .controller('AboutController', function($scope){

});
