app.controller('Teclado', function($rootScope, $scope) {
    $rootScope.lstLinhas = [];
    $rootScope.ID_INPUT = '';

    $scope.getCaracteres = function() {
        $rootScope.lstLinhas = [];
        $rootScope.lstLinhas.push(
            [
                {'caracter': 1, 'html': 1},
                {'caracter': 2, 'html': 2},
                {'caracter': 3, 'html': 3},
                {'caracter': 'backspace', 'html': '⌫'}
            ],
            [
                {'caracter': 4, 'html': 4},
                {'caracter': 5, 'html': 5},
                {'caracter': 6, 'html': 6},
                {'caracter': '-', 'html': '-'}
            ],
            [
                {'caracter': 7, 'html': 7},
                {'caracter': 8, 'html': 8},
                {'caracter': 9, 'html': 9},
                {'caracter': '+', 'html': '+'}
            ],
            [
                {'caracter': 'null', 'html': 'Nulo'},
                {'caracter': 0, 'html': 0},
                {},
                {'caracter': 'ok', 'html': '<i class="fa fa-check"></i>'}
            ]
        );
    };

    $scope.open = function(_ID_INPUT, disabled) {
        if(disabled !== true) {
            $rootScope.ID_INPUT = _ID_INPUT;
            $scope.getCaracteres();
            $('#blocoTeclado').show();
        }
    };
    $scope.close = function() {
        $('#blocoTeclado').hide();
    };

    $scope.select = function(item) {
        var _input = $('#' + $rootScope.ID_INPUT);
        var formatar = true;
        switch (item.caracter) {
            case 'backspace':
                _input.val(_input.val().substr(0, _input.val().length - 1));
                break;
            case 'ok':
                $scope.close();
                formatar = false;
                break;
            case 'null':
                _input.unpriceFormat();
                _input.val('--');
                formatar = false;
                break;
            default:
                if(_input.val() == '--' || _input.val() == '-0' || _input.val() == '-0,00' || _input.val() == '-0,000' || _input.val() == '-0,000')
                    _input.val('');
                _input.val(_input.val() + item.caracter);
                break;
        }

        if(_input.val() == '')
            _input.val('0');

        if(formatar) {
            _input.unpriceFormat();
            _input.priceFormat({
                centsLimit: parseInt(_input.attr('c')) || 0,
                prefix: '',
                centsSeparator: ',',
                thousandsSeparator: '.',
                allowNegative: true
            });
        }
        $rootScope.atualizaPercentual();
    };
});

app.controller('Compartilhar', function($rootScope, $scope) {
    $scope.MENSAGEM = "";
});

app.controller('Acumular', function($rootScope, $scope) {
    Factory.ajax(
        {
            action: 'configuracoes/getacumular'
        },
        function (data) {
            $scope.ACUMULARATE = data.ACUMULARATE;
        }
    );

    $scope.change = function(){
        $('.scrollable-content:visible').animate({scrollTop: 0}, 100);
        $rootScope.comboMenuExibir('HIDE');
        Factory.ajax(
            {
                action: 'configuracoes/checkacumularate',
                data: {
                    ACUMULARATE: $scope.ACUMULARATE?1:0
                }
            },
            function (data) {
                Factory.PAGINACAO_INFINITO.OFFSET = 0;
                Factory.updatePage();
            }
        );
    }
});

app.controller('Usuarios', function($rootScope, $scope) {
    $scope.carregarLista = function(get_grupo, IDS) {
        if(!$rootScope.USUARIOS_carregado) {
            Factory.ajax(
                {
                    action: 'configuracoes/getusuarios',
                    data: {
                        GET_GRUPO: get_grupo,
                        IDS: IDS
                    }
                },
                function (data) {
                    $rootScope.USUARIOS_carregado = true;
                    $rootScope.USUARIOS = data.USUARIOS;
                    $rootScope.GRUPOS = data.GRUPOS;
                }
            );
        }
    };
});

app.controller('Competencia', function($rootScope, $scope, $routeParams, $attrs) {
    var TIPO = $routeParams.ORIGEM_COMPETENCIA?$routeParams.ORIGEM_COMPETENCIA:$attrs.tipo;
    $scope.get = function(ano){
        if(ano)
            $('#comboCompetencia #content ul li.active').removeClass('active');

        Factory.ajax(
            {
                action: 'configuracoes/getcompetencia',
                data: {
                    tipo: TIPO,
                    ano: ano
                }
            },
            function (data) {
                $rootScope.COMPETENCIA = data.COMPETENCIA;
                $scope.lstCompetencia = data.LSTCOMPETENCIA;
                $scope.ano = data.ANO;

                // Exibir sets
                if(TIPO == 'INDICADORES')
                    $scope.exibirSetas = 1;
            }
        );
    };
    setTimeout(function() {
        $scope.get();
    }, 1);

    $scope.anoAnterior = function(){
        $scope.ano = parseInt($scope.ano) - 1;
        $scope.get($scope.ano);
    };

    $scope.anoProximo = function(){
        $scope.ano = parseInt($scope.ano) + 1;
        $scope.get($scope.ano);
    };

    $rootScope.abrirCompetencia = function(){
        $('#comboCompetencia').fadeToggle("slow");
    };

    $scope.fechar = function(){
        $('#comboCompetencia').fadeOut('fast');
        if(TIPO == 'INDICADORES' && !$('#comboCompetencia #content ul li.active').length)
            $scope.get();
    };

    $scope.select = function(item){
        $('#comboCompetencia #content ul li.active').removeClass('active');
        $('#comboCompetencia #content ul li[data-competencia="'+item.COMPETENCIA+'"]').addClass('active');
        $rootScope.COMPETENCIA = item.COMPETENCIA;

        $('#comboCompetencia').fadeToggle("slow");

        $rootScope.comboMenuExibir('HIDE');
        $('.scrollable-content:visible').animate({scrollTop: 0}, 100);

        Factory.ajax(
            {
                action: 'configuracoes/competencia',
                data: {
                    COMPETENCIAREF: item.ID,
                    tipo: TIPO,
                    COMPETENCIA: item.COMPETENCIA_SET
                }
            },
            function (data) {
                Factory.PAGINACAO_INFINITO.OFFSET = 0;
                Factory.updatePage();
            }
        );
    };
});

app.controller('Modal', function($rootScope) {
    $rootScope.showModal = function(ref){
        $('[ng-controller="Modal"][ref="'+ref+'"]').fadeToggle("slow");
    };

    $rootScope.hideModal = function(ref){
        $('[ng-controller="Modal"][ref="'+ref+'"]').fadeOut('fast');
    };
});