'use strict';
var app = angular.module(
    'App', [
        'ngRoute',
        'mobile-angular-ui',
        'mobile-angular-ui.gestures',
        'mn',
        'ngAnimate',
        'ngMaterial',
        'ngSanitize',
        'ng.deviceDetector',
        'monospaced.elastic'
    ]
);

app.config(function($routeProvider, $mdThemingProvider, $mdDateLocaleProvider, $httpProvider) {
    $mdThemingProvider.generateThemesOnDemand(true);
    $httpProvider.defaults.withCredentials = true;

    /*
     * Route
     */
    $routeProvider
        .when("/", {
            templateUrl : "view/index/index.html",
            controller: 'Index'
        })
        .when("/qr-code", {
            templateUrl : "view/qr-code/index.html",
            controller: 'QrCode'
        })
        .when("/formas-de-pagamento", {
            templateUrl : "view/formas-de-pagamento/index.html",
            controller: 'FormasDePagamento'
        })
        .when("/estabelecimentos", {
            templateUrl : "view/estabelecimentos/lst.html",
            controller: 'EstabelecimentosLst'
        })
        .when("/estabelecimentos/:ID/:MESA", {
            templateUrl : "view/estabelecimentos/lst.html",
            controller: 'EstabelecimentosLst'
        })
        .when("/estabelecimentos-filtros", {
            templateUrl : "view/estabelecimentos/filtros.html",
            controller: 'EstabelecimentosFiltros'
        })
        .when("/estabelecimentos/:ID", {
            templateUrl : "view/estabelecimentos/get.html",
            controller: 'EstabelecimentosGet'
        })
        .when("/ajuda", {
            templateUrl : "view/ajuda/index.html",
            controller: 'Ajuda'
        })
        .when("/sem-internet", {
            templateUrl : "view/sem-internet/index.html"
        });
});

app.controller('Main', function($rootScope, $scope, $http, $routeParams, $route, $mdSelect, $animate, $sce, deviceDetector) {
    $rootScope.device = deviceDetector.os;

    $rootScope.show_body = false;
    Factory.$http = $http;
    Factory.$rootScope = $rootScope;
    $scope.ambiente_teste = config.ambiente == 'homologacao' || config.ambiente == 'local'?1:0;

    var urlPesquisar = [];
    $rootScope.$on('$routeChangeStart', function() {
        $rootScope.menuClose();
    });

    $rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.controller = $route.current.controller;
    });

    $rootScope.backpageTop = function(){
        $('.scrollable:first').attr('backpage', 1);
        window.history.go(-1);
    };

    $rootScope.swipeLeft = function(){
        $rootScope.menuClose();
    };

    $rootScope.swipeRight = function(){
        if(!$('[ng-controller="Modal"]').is(':visible'))
            $rootScope.menuOpen();
    };

    $rootScope.location = function(url){
        window.location = url;
        $route.reload();
    };

    // Menu
    $rootScope.MenuLeft = [
        {
            titulo: 'Estabelecimentos',
            url: '#!/',
            icon: 'mdi-maps-local-restaurant'
        },
        {
            titulo: 'Pedidos',
            url: '#!/pedidos',
            icon: 'mdi-action-view-list'
        },
        {
            titulo: 'Cupons',
            url: '#!/cupons',
            icon: 'mdi-maps-local-offer'
        },
        {
            titulo: 'Comunidade',
            url: '#!/comunidade',
            icon: 'mdi-social-group'
        },
        {
            titulo: 'Formas de pagamento',
            url: '#!/formas-de-pagamento',
            icon: 'mdi-action-credit-card'
        },
        {
            titulo: 'Notificações',
            url: '#!/notificacoes',
            icon: 'mdi-social-notifications'
        },
        {
            titulo: 'Ajuda',
            url: '#!/ajuda',
            icon: 'mdi-action-help'
        },
        {
            titulo: 'Sobre o App',
            url: '#!/sobre',
            icon: 'mdi-hardware-phone-android'
        }
    ];

    var menuClose_time = null;
    $rootScope.menuOpen = function(){
        clearTimeout(menuClose_time);
        $('#fundo_transparente').css('display', 'block');
        setTimeout(function () {
            $('#fundo_transparente').css('opacity', '0.5');
        }, 1);
        $('.Menuleft').css('left', '0%');
        $('body').attr('menu_left', 1);
    };
    $rootScope.menuClose = function(){
        $('.Menuleft').css('left', '-80%');
        $('#fundo_transparente').css('opacity', '0');
        menuClose_time = setTimeout(function () {
            $('#fundo_transparente').hide();
        }, 1000);
        $('body').removeAttr('menu_left');
    };
});

app.directive('onErrorSrc', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function () {
                attrs.$set('src', 'img/login_default.png');
            });
        }
    }
});

/*var scrollTimeout = null;
app.directive('scroll', function($routeParams) {
    return {
        link: function(scope, element, attrs) {
            angular.element(element).bind("scroll", function () {
                if (parseInt(Factory.PAGINACAO_INFINITO.ATIVO)) {
                    var margin = 20;
                    var url_hash = window.location.hash.split('/');
                    switch (url_hash[1]) {
                        case 'minhas-acoes':
                            margin = 10;
                            break;
                        case 'performance-detalhes':
                            margin = 0;
                            break;
                        case 'performance':
                            margin = 10;
                            break;
                        case 'planos-de-acao':
                            margin = 10;
                            break;
                        case 'estruturas-de-indicadores':
                            margin = 83;
                            break;
                        case 'indicadores':
                        case '':
                            margin = 10;
                            break;
                    }
                    var scroolBottom = ($('.scrollable-content:visible > *').height() - $('.scrollable-content:visible').height() + margin) - $('.scrollable-content:visible').scrollTop();
                    if (scroolBottom <= 10) {
                        clearTimeout(scrollTimeout);
                        scrollTimeout = setTimeout(function(){
                            Factory.PAGINACAO_INFINITO.ATIVO = 1;
                            Factory.PAGINACAO_INFINITO.OFFSET = parseInt(Factory.PAGINACAO_INFINITO.OFFSET) + parseInt(Factory.PAGINACAO_INFINITO.LIMIT);
                            Factory.updatePage();
                        }, 100);
                    }
                }

                $('.scrollable-content:visible').each(function () {
                    if ($(this).is(':visible') && $(this).scrollTop() > 0)
                        $('.btn-fab').attr('scroll', 1);
                });
            });
        }
    };
});*/

app.directive('selectSearch', function() {
    return {
        restrict: 'A',
        controllerAs: '$selectSearch',
        bindToController: {},
        controller: selectSearchController
    };
});

app.directive('input', function() {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                $('input').blur();
            }
        });
    };
});