angular.module('app', ['ui.router','ngMessages', 'ngMaterial', 'angular.filter'])

    .config(function ($stateProvider, $urlRouterProvider) {

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

    .controller('BaseController', function ($scope, $window, $q, $http, cafeApi, fakeData, $mdDialog, $mdMedia, productorShow) {
        var baseUrl = 'http://si.cafesdelhuila.org/api/';


        // Filters
        //Acidez


        $scope.buscar = [];
        $scope.buscando = false;

        // Aromas
        $scope.buscar.aroma = '';
        $scope.aromas = {};
        cafeApi.getAromas().success(function (data) {
            $scope.aromas = data;
        }).error(function (data) {
            $scope.aromas = 'Error Loading';
        });

        $scope.filterAroma = function(productor) {
            if($scope.buscar.aroma == '') {
                return true;
            }
            var status = false;
            var fincas = productor.fincas;

            angular.forEach(fincas,function(finca){
                angular.forEach(finca.lotes, function(lote){
                    if($scope.buscar.aroma == lote.aroma_id) {
                        status = true;
                    }
                });
            });
            return status;
        }


        // Acidez
        $scope.buscar.acidez = '';
        $scope.acideces = {};
        cafeApi.getAcideces().success(function (data) {
            $scope.acideces = data;
        }).error(function (data) {
            $scope.acideces = 'Error Loading';
        });

        $scope.filterAcidez = function(productor) {
            if($scope.buscar.acidez == '') {
                return true;
            }
            var status = false;
            var fincas = productor.fincas;

            angular.forEach(fincas,function(finca){
                angular.forEach(finca.lotes, function(lote){
                    if($scope.buscar.acidez == lote.acidez_id) {
                        status = true;
                    }
                });
            });
            return status;
        }

        // Sabor
        $scope.buscar.sabor = '';
        $scope.sabores = {};
        cafeApi.getSabores().success(function (data) {
            $scope.sabores = data;
        }).error(function (data) {
            $scope.sabores = 'Error Loading';
        });

        $scope.filterSabor = function(productor) {
            if($scope.buscar.sabor == '') {
                return true;
            }
            var status = false;
            var fincas = productor.fincas;

            angular.forEach(fincas,function(finca){
                angular.forEach(finca.lotes, function(lote){
                    if($scope.buscar.sabor == lote.sabor_id) {
                        status = true;
                    }
                });
            });
            return status;
        }

        // Variedad
        $scope.buscar.variedad = '';
        $scope.variedades = {};
        cafeApi.getVariedades().success(function (data) {
            $scope.variedades = data;
        }).error(function (data) {
            $scope.variedades = 'Error Loading';
        });

        $scope.filterVariedad = function(productor) {
            if($scope.buscar.variedad == '') {
                return true;
            }
            var status = false;
            var fincas = productor.fincas;

            angular.forEach(fincas,function(finca){
                angular.forEach(finca.lotes, function(lote){
                    if($scope.buscar.variedad == lote.variedad1_id) {
                        status = true;
                    }
                });
            });
            return status;
        }

        // Municipios
        $scope.buscar.muni = '';
        $scope.municipios = {};
        cafeApi.getMunicipios().success(function (data) {
            $scope.municipios = data;
        }).error(function (data) {
            $scope.municipios = 'Error Loading';
        });

        $scope.filterMunicipio = function(productor) {
            if($scope.buscar.muni == '') {
                return true;
            }
            var status = false;
            var fincas = productor.fincas;

            angular.forEach(fincas,function(finca){
                if(finca.municipio_id == $scope.buscar.muni) {
                    status = true;
                }
            });
            return status;
        }



        // Organizaciones
        $scope.buscar.organizacion = "";
        $scope.organizaciones = {};
        cafeApi.getOrganizaciones().success(function (data) {
            $scope.organizaciones = data;
        }).error(function (data) {
            $scope.organizaciones = 'Error Loading';
        });

        $scope.filterOrganizacion = function(productor) {
            if($scope.buscar.organizacion == '') {
                return true;
            }

            var status = false;

            if(productor.organizacion_id == $scope.buscar.organizacion) {
                status = true;
            }

            return status
        }

        // Productores
        $scope.productores = {};


        $scope.cortaArray = function (elementos, size) {
            var spliced = [];
            var cursor = 0
            for (var i = 0; i < elementos.length / size; i++) {
                spliced.push(elementos.slice(cursor, cursor + size));
                cursor = cursor + size;
            }

            return spliced;

        }

        $scope.limpiar = function () {
            $scope.buscar.aroma = '';
            $scope.buscar.acidez = '';
            $scope.buscar.organizacion = '';
            $scope.buscar.sabor = '';
            $scope.buscar.muni = '';
            $scope.buscar.altura = '';
            $scope.buscar.variedad = '';
        }

        $scope.buscando = true;
        $scope.productores = {};
        cafeApi.getProductores().success(function (data) {
            $scope.productores = data;
            $scope.productorsTmp = $scope.cortaArray(data, 2)
            $scope.buscando = false;
        }).error(function (data) {
            $scope.organizaciones = 'Error Loading';
        });


        $scope.showAdvanced = function (ev, produc) {
            productorShow.set(produc);
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'views/productor.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: true
                })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });

        };

        function DialogController($scope, $mdDialog, productorShow, $mdToast) {


            $scope.enviando = false;
            $scope.contactar = [];
            $scope.sendContactar = function(){
                $scope.enviando = true;
                $scope.contactar.productor_id = $scope.productor.id;
                cafeApi.sendContact($scope.contactar).success(function (data) {
                    $scope.enviando = false;
                    $scope.contactar = [];
                }).error(function (data) {

                });
            }

            $scope.productor = productorShow.get();

            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
        }


    })


    .controller('AboutController', function ($scope) {

    })


    .service('productorShow', function () {
        var productor = {};

        this.get = function () {
            return productor;
        };

        this.set = function (value) {
            productor = value;
        };

    })

    .service('cafeApi', function ($http) {

        this.url = function (apiCall) {
            var baseUrl = "http://si.cafesdelhuila.org/api/";
            return baseUrl + apiCall;
        };

        this.getAromas = function () {
            return $http({method: 'jsonp', url: this.url("aromas"), params: {callback: "JSON_CALLBACK"}})
        };

        this.getAcideces = function () {
            return $http({method: 'jsonp', url: this.url("acidez"), params: {callback: "JSON_CALLBACK"}})
        };

        this.getOrganizaciones = function () {
            return $http({method: 'jsonp', url: this.url("organizaciones"), params: {callback: "JSON_CALLBACK"}})
        };

        this.getSabores = function () {
            return $http({method: 'jsonp', url: this.url("sabores"), params: {callback: "JSON_CALLBACK"}})
        };

        this.getMunicipios = function () {
            return $http({method: 'jsonp', url: this.url("municipios"), params: {callback: "JSON_CALLBACK"}})
        };

        this.getVariedades = function () {
            return $http({method: 'jsonp', url: this.url("variedades"), params: {callback: "JSON_CALLBACK"}})
        };

        this.sendContact = function (contactar) {
            return $http({method: 'jsonp', url: this.url("contactos"),
                params: {
                    callback: "JSON_CALLBACK",
                    nombre: contactar.nombre,
                    email: contactar.email,
                    telefono: contactar.telefono,
                    pais: contactar.pais,
                    mensaje: contactar.mensaje,
                    productor_id: contactar.productor_id
                }})
        };

        this.getProductores = function () {
            return $http({
                method: 'jsonp', url: this.url("productores"),
                params: {
                    callback: "JSON_CALLBACK"
                }
            })
        };

    })


    .service('fakeData', function ($http) {

        this.user = function () {
            return $http({method: 'get', dataType: 'json', url: 'https://randomuser.me/api/'})
        }

    });
