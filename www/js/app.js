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
     * Date piker
     */
    $mdDateLocaleProvider.months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho','Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    $mdDateLocaleProvider.shortMonths = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    $mdDateLocaleProvider.days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    $mdDateLocaleProvider.shortDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    $mdDateLocaleProvider.firstDayOfWeek = 0;
    $mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
        return 'Semana ' + weekNumber;
    };
    $mdDateLocaleProvider.parseDate = function(dateString) {
        var m = moment(dateString, 'D/M/YYYY', true);
        return m.isValid() ? m.toDate() : new Date(NaN);
    };
    $mdDateLocaleProvider.msgCalendar = 'Calendário';
    $mdDateLocaleProvider.msgOpenCalendar = 'Abrir calendário';

    /*
     * Route
     */
    $routeProvider
        .when("/", {
            templateUrl : "view/index/index.html",
            controller: 'Index',
            resolve: {
                CompartilharData: function ($route) {
                    Factory.PAGINACAO_INFINITO.PESQUISA = 1;
                    Factory.PAGINACAO_INFINITO.ATIVO = 1;
                    Factory.PAGINACAO_INFINITO.OFFSET = 0;
                    return Factory.ajax(
                        {
                            action: 'compartilhar/lst'
                        }
                    );
                }
            }
        })
        .when("/compartilhar", {
            templateUrl : "view/index/compartilhar.html",
            controller: 'CompartilharForm',
            resolve: {
                CompartilharFormData: function ($route) {
                    return [];
                }
            }
        })
        .when("/compartilhar/:ID", {
            templateUrl : "view/index/compartilhar.html",
            controller: 'CompartilharForm',
            resolve: {
                CompartilharFormData: function ($route) {
                    return Factory.ajax(
                        {
                            action: 'compartilhar/get',
                            data: {
                                ID: $route.current.params.ID
                            }
                        }
                    );
                }
            }
        })
        .when("/performance-resumo", {
            templateUrl : "view/performance/resumo.html",
            controller: 'PerformanceResumo',
            resolve: {
                PerformanceResumoData: function () {
                    return Factory.ajax(
                        {
                            action: 'performance/dre/getresumo'
                        }
                    );
                }
            }
        })
        .when("/performance-resumo/:ID/:CONTA", {
            templateUrl : "view/performance/resumo-linha-do-tempo.html",
            controller: 'PerformanceResumoLinhaDoTempo',
            resolve: {
                PerformanceResumoLinhaDoTempoData: function ($route) {
                    return Factory.ajax(
                        {
                            action: 'performance/dre/getresumolinhadotempo',
                            data: {
                                ID: $route.current.params.ID,
                                CONTA_DETALHES: parseInt($route.current.params.CONTA)
                            }
                        }
                    );
                }
            }
        })
        .when("/performance", {
            templateUrl : "view/performance/index.html",
            controller: 'Performance',
            resolve: {
                PerformanceData: function () {
                    Factory.PAGINACAO_INFINITO.PESQUISA = 1;
                    Factory.PAGINACAO_INFINITO.ATIVO = 1;
                    Factory.PAGINACAO_INFINITO.OFFSET = 0;
                    return Factory.ajax(
                        {
                            action: 'performance/dre/getcontas'
                        }
                    );
                }
            }
        })
        .when("/performance-filtros", {
            templateUrl : "view/performance/filtros.html",
            controller: 'PerformanceFiltros',
            resolve: {
                PerformanceFiltrosData: function () {
                    return Factory.ajax(
                        {
                            action: 'configuracoes/getfiltros'
                        }
                    );
                }
            }
        })
        .when("/performance/:ID", {
            templateUrl : "view/performance/index.html",
            controller: 'Performance',
            resolve: {
                PerformanceData: function ($route) {
                    Factory.PAGINACAO_INFINITO.PESQUISA = 1;
                    Factory.PAGINACAO_INFINITO.ATIVO = 1;
                    Factory.PAGINACAO_INFINITO.OFFSET = 0;
                    return Factory.ajax(
                        {
                            action: 'performance/dre/getcontas',
                            data: {
                                ID: $route.current.params.ID
                            }
                        }
                    );
                }
            }
        })
        .when("/performance-detalhes/:ID", {
            templateUrl : "view/performance/detalhes.html",
            controller: 'PerformanceDetalhes',
            resolve: {
                PerformanceDetalhesData: function ($route) {
                    Factory.PAGINACAO_INFINITO.ATIVO = 1;
                    Factory.PAGINACAO_INFINITO.OFFSET = 0;
                    return Factory.ajax(
                        {
                            action: 'performance/dre/get',
                            data: {
                                ID: parseInt($route.current.params.ID),
                                DETALHES: Performance.DETALHES
                            }
                        }
                    );
                }
            }
        })
        .when("/performance-indicadores", {
            templateUrl : "view/performance/indicadores.html",
            controller: 'PerformanceIndicadores',
            resolve: {
                PerformanceIndicadoresData: function () {
                    return Factory.ajax(
                        {
                            action: 'performance/dre/getperformanceindicadores'
                        }
                    );
                }
            }
        })
        //fim performance
        .when("/indicadores", {
            templateUrl : "view/indicadores/index.html",
            controller: 'Indicadores',
            resolve: {
                IndicadoresData: function($route){
                    Factory.PAGINACAO_INFINITO.PESQUISA = 1;
                    Factory.PAGINACAO_INFINITO.ATIVO = 1;
                    Factory.PAGINACAO_INFINITO.OFFSET = 0;
                    return Factory.ajax(
                        {
                            action: 'indicadores/get',
                            data: {
                                ID: $route.current.params.ID
                            }
                        }
                    );
                }
            }
        })
        .when("/indicadores-detalhes/:ID/:TIPO", {
            templateUrl : "view/indicadores/detalhes.html",
            controller: 'DetalhesIndicadores',
            resolve: {
                DetalhesIndicadoresData: function($route){
                    return Factory.ajax(
                        {
                            action: 'indicadores/detalhes',
                            data: {
                                ID: $route.current.params.ID,
                                TIPO: $route.current.params.TIPO
                            }
                        }
                    );
                }
            }
        })
        .when("/indicadores-detalhes/:ID/:TIPO/:ORIGEM_COMPETENCIA", {
            templateUrl : "view/indicadores/detalhes.html",
            controller: 'DetalhesIndicadores',
            resolve: {
                DetalhesIndicadoresData: function($route){
                    return Factory.ajax(
                        {
                            action: 'indicadores/detalhes',
                            data: {
                                ID: $route.current.params.ID,
                                TIPO: $route.current.params.TIPO,
                                ORIGEM_COMPETENCIA: $route.current.params.ORIGEM_COMPETENCIA
                            }
                        }
                    );
                }
            }
        })
        .when("/estruturas-de-indicadores", {
            templateUrl : "view/indicadores/estruturas-de-indicadores.html",
            controller: 'EstruturasDeIndicadores',
            resolve: {
                EstruturasDeIndicadoresData: function(){
                    Factory.PAGINACAO_INFINITO.PESQUISA = 1;
                    Factory.PAGINACAO_INFINITO.ATIVO = 1;
                    Factory.PAGINACAO_INFINITO.OFFSET = 0;
                    return Factory.ajax(
                        {
                            action: 'indicadores/estruturadeindicadores'
                        }
                    );
                }
            }
        })
        .when("/estruturas-de-indicadores/:ID", {
            templateUrl : "view/indicadores/estruturas-de-indicadores.html",
            controller: 'EstruturasDeIndicadores',
            resolve: {
                EstruturasDeIndicadoresData: function($route){
                    Factory.PAGINACAO_INFINITO.PESQUISA = 1;
                    Factory.PAGINACAO_INFINITO.ATIVO = 1;
                    Factory.PAGINACAO_INFINITO.OFFSET = 0;
                    return Factory.ajax(
                        {
                            action: 'indicadores/estruturadeindicadores',
                            data: {
                                ID: $route.current.params.ID
                            }
                        }
                    );
                }
            }
        })
        .when("/estruturas-de-indicadores/:ID/:INDICADOR", {
            templateUrl : "view/indicadores/estruturas-de-indicadores.html",
            controller: 'EstruturasDeIndicadores',
            resolve: {
                EstruturasDeIndicadoresData: function($route){
                    Factory.PAGINACAO_INFINITO.PESQUISA = 1;
                    Factory.PAGINACAO_INFINITO.ATIVO = 1;
                    Factory.PAGINACAO_INFINITO.OFFSET = 0;
                    return Factory.ajax(
                        {
                            action: 'indicadores/estruturadeindicadores',
                            data: {
                                ID: $route.current.params.ID,
                                INDICADOR: $route.current.params.INDICADOR
                            }
                        }
                    );
                }
            }
        })
        .when("/analise-justificativa-indicador/:ID/:TIPO/:ITEM", {
            templateUrl : "view/indicadores/analise-justificativa-indicador.html",
            controller: 'AnaliseJustificativaIndicador',
            resolve: {
                AnaliseJustificativaIndicadorData: function($route){
                    return Factory.ajax(
                        {
                            action: 'indicadores/detalhes',
                            data: {
                                ID: $route.current.params.ID,
                                TIPO: 'ANALISE',
                                ITEM: $route.current.params.ITEM
                            }
                        }
                    );
                }
            }
        })
        .when("/analise-justificativa-indicador/:ID/:TIPO/:ORIGEM_COMPETENCIA/:ITEM", {
            templateUrl : "view/indicadores/analise-justificativa-indicador.html",
            controller: 'AnaliseJustificativaIndicador',
            resolve: {
                AnaliseJustificativaIndicadorData: function($route){
                    return Factory.ajax(
                        {
                            action: 'indicadores/detalhes',
                            data: {
                                ID: $route.current.params.ID,
                                ORIGEM_COMPETENCIA: $route.current.params.ORIGEM_COMPETENCIA,
                                TIPO: 'ANALISE',
                                ITEM: $route.current.params.ITEM
                            }
                        }
                    );
                }
            }
        })
        .when("/minhas-acoes", {
            templateUrl : "view/acoes/index.html",
            controller: 'MinhasAcoes',
            resolve: {
                MinhasAcoesData: function($route){
                    return Factory.ajax(
                        {
                            action: 'acoes/lst'
                        }
                    );
                }
            }
        })
        .when("/minhas-acoes-detalhes/:ID", {
            templateUrl : "view/acoes/acoes-detalhes.html",
            controller: 'AcoesDetalhes',
            resolve: {
                AcoesDetalhesData: function($rootScope, $route){
                    if(parseInt($route.current.params.ID)) {
                        return Factory.ajax(
                            {
                                action: 'acoes/get',
                                data: {
                                    ID: $route.current.params.ID
                                }
                            }
                        );
                    }else {
                        return $route.current.params.ID == 'EDITAR' ?
                            $rootScope.ACAO :
                            [];
                    }
                }
            }
        })
        .when("/minhas-acoes-detalhes/:ID/:ID_PLANO_ACAO", {
            templateUrl : "view/acoes/acoes-detalhes.html",
            controller: 'AcoesDetalhes',
            resolve: {
                AcoesDetalhesData: function($rootScope, $route){
                    if(parseInt($route.current.params.ID)) {
                        return Factory.ajax(
                            {
                                action: 'acoes/get',
                                data: {
                                    ID: $route.current.params.ID,
                                    ID_PLANO_ACAO: $route.current.params.ID_PLANO_ACAO
                                }
                            }
                        );
                    }else {
                        return $route.current.params.ID == 'EDITAR' ?
                            $rootScope.ACAO :
                            [];
                    }
                }
            }
        })
        .when("/planos-de-acao", {
            templateUrl : "view/acoes/planos-de-acao.html",
            controller: 'PlanoDeAcao',
            resolve: {
                PlanoDeAcaoData: function(){
                    return Factory.ajax(
                        {
                            action: 'planosdeacao/lst'
                        }
                    );
                }
            }
        })
        .when("/planos-de-acao-detalhes/:ID", {
            templateUrl : "view/acoes/planos-de-acao-detalhes.html",
            controller: 'PlanoDeAcaoDetalhes',
            resolve: {
                PlanoDeAcaoDetalhesData: function($rootScope, $route){
                    if(parseInt($route.current.params.ID)) {
                        if($rootScope.STATUS_ADD_EDT == 'ADD')
                            $rootScope.STATUS_ADD_EDT = 'EDT';
                        
                        return Factory.ajax(
                            {
                                action: 'planosdeacao/get',
                                data: {
                                    ID: $route.current.params.ID
                                }
                            }
                        );
                    }else {
                        if ($rootScope.STATUS_ADD_EDT == 'EDT') {
                            $rootScope.STATUS_ADD_EDT = null;
                            window.history.go(-1);
                        } else
                            $rootScope.STATUS_ADD_EDT = 'ADD';
                        return [];
                    }
                }
            }
        })
        .when("/planos-de-acao-detalhes/:ID/:ID_ITEM", {
            templateUrl : "view/acoes/planos-de-acao-detalhes.html",
            controller: 'PlanoDeAcaoDetalhes',
            resolve: {
                PlanoDeAcaoDetalhesData: function($route){
                    return [];
                }
            }
        })
        .when("/sem-internet", {
            templateUrl : "view/sem-internet/index.html"
        });
});

app.controller('Main', function($rootScope, $scope, $http, $routeParams, $route, $mdSelect, $animate, $sce, deviceDetector) {
    $rootScope.device = deviceDetector.os;

    $rootScope.lstSlider = [];
    $rootScope.QTDEACOES = 0;
    $rootScope.QTDECOMPARTILHAR = 0;
    Factory.$http = $http;
    Factory.$rootScope = $rootScope;
    $scope.ambiente_teste = config.ambiente == 'homologacao' || config.ambiente == 'local'?1:0;

    var urlPesquisar = [];
    $rootScope.$on('$routeChangeStart', function() {
        // Criterio - pesquisa
        $rootScope.criterio = urlPesquisar[window.location.hash] = urlPesquisar[window.location.hash] || '';

        // Desativa pesquisa
        Factory.PAGINACAO_INFINITO.PESQUISA = 0;

        // Paginacao infinito - Disativando
        Factory.PAGINACAO_INFINITO.ATIVO = 0;
        Factory.PAGINACAO_INFINITO.OFFSET = 0;
        $animate.enabled(true);
        $rootScope.USUARIOS_carregado = false;

        // Close teclado
        $('#blocoTeclado').hide();
        $rootScope.menuClose();
    });

    $rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.centroSubTop = false;

        // set subtituloMedicao igual null, é usado apenas em Estrutura de indicadores
        $rootScope.subTituloMedicao = null;
        $('#toolbar .title').css('width','100%');

        $rootScope.controller = $route.current.controller;
        setTimeout(function () {
            $animate.enabled(false);
            $("input.md-datepicker-input").prop('readonly', true);
        }, 100);

        // Get - configuracoes
        var url_hash = window.location.hash.replace('#!/', '').split('/');
        Factory.ajax(
            {
                action: 'configuracoes/get',
                data: {
                    URL_HASH: url_hash[0]
                }
            },
            function (data) {
                // Qtde de acoes
                $rootScope.QTDEACOES = parseInt(data.QTDEACOES) || 0;

                // Qtde compartilhar
                $rootScope.QTDECOMPARTILHAR = parseInt(data.QTDECOMPARTILHAR) || 0;

                // Slide
                if(data.lstSlider.length) {
                    $rootScope.lstSlider = data.lstSlider;
                    setTimeout(function () {
                        $('#slider').fadeToggle('fast');
                    }, 500);
                }
            }
        );
    });

    $rootScope.slider = function(direction){
        var li_active = $('#slider li.active');
        switch (direction){
            case 'next':
                if(li_active.next('li').length) {
                    li_active.removeClass('active');
                    li_active.next('li').addClass('active');
                    if(!$('#slider li.active').next('li').length)
                        $('#slider button').show();
                }else {
                    $rootScope.lstSlider = [];
                    $('#slider').fadeToggle('fast');
                }
                break;
            case 'prev':
                $('#slider button').hide();
                if(li_active.prev('li').length) {
                    li_active.removeClass('active');
                    li_active.prev('li').addClass('active');
                }
                break
        }
    };

    var url_location_bottom = [];
    $rootScope.locationMenuLeft = function(menu){
		url_location_bottom[menu.url_pai] = menu.url;
        $scope.location(menu.url);
    };
    $rootScope.locationBottom = function(url){
        if(!url_location_bottom[url])
            url_location_bottom[url] = url;
        $scope.location(url_location_bottom[url]);
    };

    $rootScope.backpageTop = function(){
        $('.scrollable:first').attr('backpage', 1);
        window.history.go(-1);
        if(parseInt($rootScope.SEMEFEITO_ATIVAR)) {
            $rootScope.SEMEFEITO_ATIVAR = null;
            $rootScope.SEMEFEITO = 1;
        }
    };

    $rootScope.trustAsHtml = function(string) {
        return $sce.trustAsHtml(string);
    };

    var pesquisarTimeout = null;
    $rootScope.pesquisar = function(){
        clearTimeout(pesquisarTimeout);
        pesquisarTimeout = setTimeout(function(){
            urlPesquisar[window.location.hash] = $rootScope.criterio;
            if(parseInt(Factory.PAGINACAO_INFINITO.PESQUISA)) {
                Factory.PAGINACAO_INFINITO.ATIVO = 1;
                Factory.PAGINACAO_INFINITO.OFFSET = 0;
                Factory.updatePage();
            }
        }, 500);
    };

    $rootScope.limpaBusca = function(){
        $rootScope.criterio = '';
        urlPesquisar[window.location.hash] = '';
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

    $rootScope.formatDate = function (date) {
        return date?moment(date).format('YYYY-MM-DD'):'';
    }

    $rootScope.format = 'DD/MM/YYYY';
    $rootScope.locale = {
        formatDate: function(date) {
            var m = moment(date);
            return m.isValid() && date ? m.format($scope.format) : '';
        }
    };

    // Close select
    $scope.closeSelect = function () {
        $mdSelect.hide()
    };

    // Menu
    $rootScope.MenuLeft = [
        {
            titulo: 'Mapa',
            icone: 'fa fa-share-alt',
            url_pai: '#!/',
            url: '#!/',
            tipo: 'pai'
        }/*,
        {
            titulo: 'Performance',
            icone: 'mdi mdi-chart-line',
			url_pai: '#!/performance-resumo',
            url: '#!/performance-resumo',
            tipo: 'pai'
        },
        {
            titulo: 'Resumo da performance',
			url_pai: '#!/performance-resumo',
            url: '#!/performance-resumo',
            tipo: 'filho'
        },
        {
            titulo: 'Demonstração de resultado',
			url_pai: '#!/performance-resumo',
            url: '#!/performance',
            tipo: 'filho'
        },
        {
            titulo: 'Indicadores econômicos',
			url_pai: '#!/performance-resumo',
            url: '#!/performance-indicadores',
            tipo: 'filho'
        },
        {
            titulo: 'Indicadores',
            icone: 'mdi mdi-chart-bar',
			url_pai: '#!/indicadores',
            url: '#!/indicadores',
            tipo: 'pai'
        },
        {
            titulo: 'Meus indicadores',
			url_pai: '#!/indicadores',
            url: '#!/indicadores',
            tipo: 'filho'
        },
        {
            titulo: 'Estrutura de indicadores',
			url_pai: '#!/indicadores',
            url: '#!/estruturas-de-indicadores',
            tipo: 'filho'
        },
        {
            titulo: 'Ações',
            icone: 'mdi mdi-checkbox-marked-outline',
			url_pai: '#!/minhas-acoes',
            url: '#!/minhas-acoes',
            tipo: 'pai'
        },
        {
            titulo: 'Minhas ações',
			url_pai: '#!/minhas-acoes',
            url: '#!/minhas-acoes',
            tipo: 'filho'
        },
        {
            titulo: 'Planos de ação',
			url_pai: '#!/minhas-acoes',
            url: '#!/planos-de-acao',
            tipo: 'filho'
        }*/
    ];

    $rootScope.menuOpcoes = function(menu){
        $('#lstMenu li, #lstMenuConteudo li').removeClass('active');
        $('#lstMenu li[data-menu="'+menu+'"], #lstMenuConteudo li[data-menu="'+menu+'"]').addClass('active');
    };

    var menuClose_time = null;
    $rootScope.menuOpen = function(){
        clearTimeout(menuClose_time);
        $('#fundo_transparente').css('display', 'block');
        setTimeout(function () {
            $('#fundo_transparente').css('opacity', '0.5');
        }, 1);
        $('.Menuleft').css('left', '0%');
    };
    $rootScope.menuClose = function(){
        $('.Menuleft').css('left', '-80%');
        $('#fundo_transparente').css('opacity', '0');
        menuClose_time = setTimeout(function () {
            $('#fundo_transparente').hide();
        }, 1000);
    };

    $rootScope.comboMenuExibir = function(TIPO){
        switch (TIPO){
            case 'HIDE':
                $('#comboMenuOpcoes').slideUp('fast');
                $('.fundoMenu').fadeOut('fast');
                break;
            default:
                $('#comboMenuOpcoes').stop(true, true).slideToggle('fast');
                $('.fundoMenu').fadeToggle('fast');
                if ($("#filtroAuxiliar").is(":visible") == true)
                    $('.scrollable-content').animate({scrollTop:0}, 'slow');
                break;
        }
    };

    $rootScope.Compartilhar = function (origem, values) {
        values.ORIGEM = origem;
        $rootScope.COMPARTILHAR = values;
        //localStorage.setItem("COMPARTILHAR", JSON.stringify($rootScope.COMPARTILHAR));
        $rootScope.location('#!/compartilhar');
    };

    //Plano de ação  - atualizar ação
    var alterarStatus_timeout = null;
    $rootScope.alterarStatus = function(status){
        if($rootScope.PLANODEACAO.PERMISSAO) {
            $rootScope.PLANODEACAO.STATUS = status;
            if (parseInt($routeParams.ID)) {
                clearTimeout(alterarStatus_timeout);
                alterarStatus_timeout = setTimeout(function () {
                    Factory.ajax(
                        {
                            action: 'planosdeacao/alterarstatus',
                            form: $('#formPlanoDeAcao'),
                            data: {
                                ID: parseInt($routeParams.ID),
                                STATUS: $('#formPlanoDeAcao input[name="STATUS"]').val()
                            }
                        }
                    );
                }, 500);
            }
        }
    };
    //show modal atualizar Acao
    $rootScope.AtualizarAcao = function(DADOS) {
        $rootScope.FORM_ATUALIZAR_ORIGINAL = DADOS;
        $rootScope.FORM_ATUALIZAR = $.extend([], DADOS);
        if($rootScope.FORM_ATUALIZAR.PERMISSAO) {
            switch ( $rootScope.FORM_ATUALIZAR.STATUS) {
                case 1:
                    $rootScope.FORM_ATUALIZAR.SLIDER_DISABLED = true;
                    $rootScope.FORM_ATUALIZAR.STATUS_LABEL = 'Em espera';
                    break;
                case 2:
                    $rootScope.FORM_ATUALIZAR.SLIDER_DISABLED = true;
                    $rootScope.FORM_ATUALIZAR.STATUS_LABEL = 'Para fazer';
                    break;
                case 4:
                    $rootScope.FORM_ATUALIZAR.PERCENTUAL = 100;
                    $rootScope.FORM_ATUALIZAR.CHANGE_PERCENTUAL = 1;
                    $rootScope.FORM_ATUALIZAR.SLIDER_DISABLED = false;
                    $rootScope.FORM_ATUALIZAR.STATUS_LABEL = 'Concluída';
                    break;
                case 3:
                    $rootScope.FORM_ATUALIZAR.SLIDER_DISABLED = false;
                    $rootScope.FORM_ATUALIZAR.STATUS_LABEL = 'Em andamento';
                    break;
            }
        }
        $rootScope.statusProcess = function (status, alterar_99_porc) {
            if($rootScope.FORM_ATUALIZAR.PERMISSAO) {
                var status_old = $rootScope.FORM_ATUALIZAR.STATUS;
                $rootScope.FORM_ATUALIZAR.STATUS = status;
                switch (status) {
                    case 1:
                        if(alterar_99_porc !== false && status_old == 4)
                            $rootScope.FORM_ATUALIZAR.PERCENTUAL = 99;
                        $rootScope.FORM_ATUALIZAR.SLIDER_DISABLED = true;
                        $rootScope.FORM_ATUALIZAR.STATUS_LABEL = 'Em espera';
                        break;
                    case 2:
                        if(alterar_99_porc !== false && status_old == 4)
                            $rootScope.FORM_ATUALIZAR.PERCENTUAL = 99;
                        $rootScope.FORM_ATUALIZAR.SLIDER_DISABLED = true;
                        $rootScope.FORM_ATUALIZAR.STATUS_LABEL = 'Para fazer';
                        break;
                    case 4:
                        $('form').css('height' , '300px');
                        $rootScope.FORM_ATUALIZAR.PERCENTUAL = 100;
                        $rootScope.FORM_ATUALIZAR.CHANGE_PERCENTUAL = 1;
                        $rootScope.FORM_ATUALIZAR.SLIDER_DISABLED = false;
                        $rootScope.FORM_ATUALIZAR.STATUS_LABEL = 'Concluída';
                        break;
                    case 3:
                        if(alterar_99_porc !== false && status_old == 4)
                            $rootScope.FORM_ATUALIZAR.PERCENTUAL = 99;
                        $rootScope.FORM_ATUALIZAR.SLIDER_DISABLED = false;
                        $rootScope.FORM_ATUALIZAR.STATUS_LABEL = 'Em andamento';
                        break;
                }
            }
        };
        $rootScope.alterSliderStatus = function () {
            $('form').css('height' , '300px');
            $rootScope.statusProcess(3, false);
            $rootScope.FORM_ATUALIZAR.CHANGE_PERCENTUAL = 1;
            if(!parseInt($rootScope.FORM_ATUALIZAR.PERCENTUAL || 0)) {
                $rootScope.FORM_ATUALIZAR.CHANGE_PERCENTUAL = 0;
                $('#OBSERVACAO').val('');
                $rootScope.FORM_ATUALIZAR.OBSERVACAO = '';
            }else if(parseInt($rootScope.FORM_ATUALIZAR.PERCENTUAL) == 100)
                $rootScope.statusProcess(4);
        };
        //apresenta modal
        $rootScope.showModal('AtualizarAcao');
    };
    // Salvar acao
    $rootScope.salvarAcao = function () {
        Factory.ajax(
            {
                action: 'acoes/formatualizaracao',
                form: $('#formAcao'),
                data: $.extend(
                    {
                        ID: parseInt($rootScope.FORM_ATUALIZAR.ID)
                    },
                    $('#formAcao').serializeArray()
                )
            },
            function (data) {
                if(data.status == '1'){
                    $rootScope.FORM_ATUALIZAR_ORIGINAL.STATUS_TERMINO = data.STATUS_TERMINO;
                    $rootScope.FORM_ATUALIZAR_ORIGINAL.ATRASADO = data.ATRASADO;
                    $rootScope.FORM_ATUALIZAR_ORIGINAL.PERCENTUAL = data.PERCENTUAL;
                    $rootScope.FORM_ATUALIZAR_ORIGINAL.STATUS = data.STATUS;
                    $rootScope.FORM_ATUALIZAR_ORIGINAL.STATUS_LABEL = data.STATUS_LABEL;
                    $rootScope.hideModal('AtualizarAcao');
                }
            }
        );
        return false;
    }
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

var scrollTimeout = null;
app.directive('scroll', function($routeParams) {
    return {
        link: function(scope, element, attrs) {
            angular.element(element).bind("scroll", function () {
                /*
                 * Paginacao infinito
                 */
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

                /*
                 * Scroll button fab
                 */
                $('.scrollable-content:visible').each(function () {
                    if ($(this).is(':visible') && $(this).scrollTop() > 0)
                        $('.btn-fab').attr('scroll', 1);
                });
            });
        }
    };
});

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

app.directive('contenteditable', ['$sce', function($sce) {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            // Specify how UI should be updated
            ngModel.$render = function() {
                element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
            };

            // Listen for change events to enable binding
            element.on('blur keyup change', function() {
                scope.$evalAsync(read);
            });
            read(); // initialize

            // Write data to the model
            function read() {
                var html = element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if ( attrs.stripBr && html == '<br>' ) {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }
        }
    };
}]);

selectSearchController.$inject = ['$element', '$scope'];
function selectSearchController($element, $scope) {
    this.$postLink = function $postLink() {
        var menu = $element.closest('.md-select-menu-container');
        $scope.$watch(function focusSearchCheck() {
            return menu.hasClass('md-active') ? menu[0].id : undefined;
        }, function focusSearch(activeMenuId) {
            if(activeMenuId) {
                $element.focus();
            }
        });

        var topOption = null;
        var upEventListener = function onOptionNavigate(event) {
            var KEYCODE_UP = 38;
            if(event.keyCode === KEYCODE_UP) {
                var target = angular.element(event.target);

                var prevIsHeader = target.prev().is('md-select-header');

                if(!prevIsHeader)
                    prevIsHeader = target.prev()[0] == null && target.parent().is('md-optgroup') && target.parent().prev().is('md-select-header');
                if(prevIsHeader) {
                    $element.focus();
                    event.stopPropagation();
                }
            }
        };

        $scope.$watchCollection(function () {
            return menu.find('md-option')
                .toArray()
                .map(function (option) {
                    return option.id;
                });
        }, function (ids) {
            if(ids.length > 0){
                var jTop = menu.find('md-option').eq(0);
                var top = jTop[0];
                if(topOption && topOption != top)
                    angular.element(topOption).off('keydown', upEventListener);
                topOption = top;
                jTop.on('keydown', upEventListener);
            }
        });

        $element.on('keydown', function onSearchNavigate(event) {
            var KEYCODE_DOWN = 40;
            if(event.keyCode === KEYCODE_DOWN) {
                if(menu.hasClass('md-active'))
                    menu.find('md-option')
                        .eq(0)
                        .focus();
            }
            event.stopPropagation();
        });
    };
}