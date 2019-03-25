app.controller('Indicadores', function($rootScope, $scope, $location, $routeParams, IndicadoresData) {
    $scope.positiveNumber = 0;
    $scope.negativeNumber = 0;
    $scope.decimal  = 0;
    $scope.decimalUpto  = 0;
    $scope.negativedecimal  = 0;
    $scope.negativedecimalUpto  = 0;
    $scope.total = 0;

    // Menu direito
    $rootScope.MenuRight = [];

    Factory.$swipeLeftPageBefore = true;
    if(parseInt($routeParams.ID)) {
        $('#tituloTop').hide();
        $('#subTituloTop').show();
    }else{
        $('#tituloTop').show();
        $('#subTituloTop').hide();
    }
    Factory.activeMenuBottom('indicadores');

    $scope.exibirMenu = function (registro) {
        if(!$('li[data-id="'+registro.ID+'"] .menu').hasClass('active')){
            $('li[data-id!="'+registro.ID+'"] .menu').removeClass('active');
            $('li[data-id="'+registro.ID+'"] .menu').addClass('active');
        }
    };
    $scope.esconderMenu = function (registro) {
        if($('li[data-id="'+registro.ID+'"] .menu').hasClass('active'))
            $('li[data-id="'+registro.ID+'"] .menu').removeClass('active');
        else
            $rootScope.swipeRight();
    };

    // Efeito
    if (parseInt($rootScope.SEMEFEITO))
        $rootScope.SEMEFEITO = null;
    else
        $scope.efeitoLst = 'efeitoLst';

    // Get indicadores
    $scope.Indicadores = function (data) {
        if(parseInt(Factory.PAGINACAO_INFINITO.OFFSET) && parseInt(Factory.PAGINACAO_INFINITO.ATIVO)){
            if(data.lst.length) {
                $.each(data.lst, function (idx, val) {
                    $scope.lst.push(val);
                });
            }else
                Factory.PAGINACAO_INFINITO.ATIVO = 0;
        }else {
            // Titulo
            if ($routeParams.ID) {
                $rootScope.subTitulo = data.DADOS.NOME;

                // Resposavel
                $('#top img').attr('src', data.DADOS.IMAGEMRESPONSAVEL);
                $scope.NOME = data.DADOS.NOMERESPONSAVEL;
                $scope.EMAIL = data.DADOS.EMAILRESPONSAVEL;
            } else {
                $rootScope.titulo = 'Meus indicadores';

                // Resposavel
                $.when(Login.get()).done(function (_return) {
                    $('#top img').attr('src', _return.url_avatar);
                    $scope.NOME = _return.NOME;
                    $scope.EMAIL = _return.EMAIL;
                });
            }

            // Lst
            if(data.lst.length || $rootScope.criterio)
                $scope.lst = data.lst;

            // Efeito
            if (!parseInt($rootScope.SEMEFEITO)) {
                setTimeout(function () {
                    $('.efeitoLst').attr('efeito', 1);
                }, 1);
            }
        }
    };
    $scope.Indicadores(IndicadoresData);

    // Update page
    Factory.updatePage = function(){
        Factory.ajax(
            {
                action: 'indicadores/get',
                data: {
                    ID: parseInt($routeParams.ID)
                }
            },
            function (data) {
                $scope.Indicadores(data);
            }
        );
    };

    $scope.salvarMedicao = function(){
        Factory.submit(
            $('#formMedicao'),
            function (data) {
                $scope.FORM_INDICADOR.META = data.META;
                $scope.FORM_INDICADOR.REAL = data.REAL;
                $scope.FORM_INDICADOR.VAR_PERCENTUAL = data.VAR_PERCENTUAL;
                $scope.FORM_INDICADOR.COR_PERCENTUAL = data.COR_PERCENTUAL;
            }
        );
        $rootScope.hideModal('Medicao');
    };

    var atualizaPercentualTimeOut = null;
    $rootScope.atualizaPercentual = function(time) {
        if(atualizaPercentualTimeOut)
            clearTimeout(atualizaPercentualTimeOut);

        atualizaPercentualTimeOut = setTimeout(function(){
            Factory.ajax(
                {
                    action: 'indicadores/getpercentual',
                    data: {
                        ID: $scope.FORM_INDICADOR.ID,
                        META: $("#META_MEDICAO").val(),
                        REAL: $("#REAL_MEDICAO").val()
                    }
                },
                function (data) {
                    // Grafico
                    $('#graff').highcharts('SparkLine', {
                        title : {
                            text : ''
                        },
                        height: 100,
                        credits: {
                            enabled: false
                        },
                        xAxis : [{
                            categories: data.competencia_meses
                        }],
                        yAxis : [{
                            title: {text: ''},
                            showFirstLabel: false,
                            showLastLabel: false,
                            opposite: true,
                            gridLineColor: '#e2e2e2'
                        }, {
                            title: {text: ''},
                            showFirstLabel: false,
                            showLastLabel: false,
                            gridLineColor: '#e2e2e2'
                        }],
                        exporting: {
                            enabled: false
                        },
                        plotOptions: {
                            column: {
                                grouping: false,
                                shadow: false,
                                borderWidth: 0
                            },
                            spline: {
                                marker: {
                                    radius: 0
                                },
                                lineWidth: 4,
                                states: {
                                    hover: {
                                        lineWidth: 4
                                    }
                                },
                                threshold: null
                            }
                        },
                        tooltip: {
                            shared: true,
                            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y_tooltip}</b><br/>'
                        },
                        legend: {
                            enabled: false,
                            borderWidth: 0,
                            shadow: true,
                            labelFormatter: function() {
                                return this.name;
                            }
                        },
                        series: data.data_series
                    });
                    $('#PERFORMANCE').html(data.VALOR);
                    $('#conteudo_medicao form .porc').attr('sinal', data.COR);
                    $('#conteudo_medicao').animate({scrollTop: 500}, 'slow');
                }
            );
        }, time?time:800);
    };

    $scope.medicao = function(ind) {
        // Esconde menu
        $scope.esconderMenu(ind);

        // Indicador
        $scope.FORM_INDICADOR = ind;

        // Format
        $(".formatValor").unpriceFormat().priceFormat({
            centsLimit: ind.CASAS,
            prefix: '',
            centsSeparator: ',',
            thousandsSeparator: '.',
            allowNegative: true
        });

        $("#META_MEDICAO").val(ind.META);
        $("#REAL_MEDICAO").val(ind.REAL);
        $("#PERFORMANCE").html(ind.VAR_PERCENTUAL);
        $('#conteudo_medicao form .porc').attr('sinal', ind.COR_PERCENTUAL);

        //apresenta modal
        $rootScope.showModal('Medicao');
        $rootScope.atualizaPercentual(1);
    };

});

app.controller('DetalhesIndicadores', function($rootScope, $scope, $routeParams, DetalhesIndicadoresData) {
    Factory.$swipeLeftPageBefore = true;
    $('#tituloTop').hide();
    $('#subTituloTop').show();
    Factory.activeMenuBottom('indicadores');

    // Titulo
    $rootScope.subTitulo = $routeParams.TIPO == 'INDICADOR'?'Detalhamento do indicador':'Detalhamento da estrutura';

    // Origem
    $scope.ORIGEM_COMPETENCIA = $routeParams.ORIGEM_COMPETENCIA?'/'+$routeParams.ORIGEM_COMPETENCIA:'';

    // Sem efeito
    $rootScope.SEMEFEITO_ATIVAR = 1;

    // Get detalhes
    $scope.DetalhesIndicadores = function (data) {
        // Dados
        $scope.registro = data.DADOS;

        // Tipo
        $scope.registro.TIPO = $routeParams.TIPO;

        // Grafico
        setTimeout(function(){
            $('#detalhesIndicador #graf')
                .highcharts(
                    jsonGraficos(
                        'IndicadoresDetalhar',
                        data.DADOS
                    )
                );
        }, 500);
    };
    $scope.DetalhesIndicadores(DetalhesIndicadoresData);

    // Atualizar pagina
    Factory.updatePage = function() {
        Factory.ajax(
            {
                action: 'indicadores/detalhes',
                data: {
                    ID: $routeParams.ID,
                    TIPO: $routeParams.TIPO,
                    ORIGEM_COMPETENCIA: $routeParams.ORIGEM_COMPETENCIA
                }
            },
            function (data) {
                $scope.DetalhesIndicadores(data);
            }
        );
    };
});

app.controller('EstruturasDeIndicadores', function($rootScope, $scope, $routeParams, EstruturasDeIndicadoresData) {
    Factory.$swipeLeftPageBefore = true;
    $rootScope.centroSubTop = true;
    if(parseInt($routeParams.ID)) {
        $('#tituloTop').hide();
        $('#subTituloTop').show();
    }else{
        $('#tituloTop').show();
        $('#subTituloTop').hide();
    }
    Factory.activeMenuBottom('indicadores');

    // Titulo
    $rootScope.titulo = 'Estrutura de indicadores';

    // Get estrutura nivel zero
    $scope.getEstruturas = function(){
        Factory.ajax(
            {
                action: 'indicadores/getlstestruturas'
            },
            function (data) {
                $('#filtroTop').show();
                $scope.LSTESTRUTURA = data.LSTESTRUTURA;
                $scope.ESTRUTURA_SELECIONADO = data.ESTRUTURA_SELECIONADO;
            }
        );
    };
    $scope.getEstruturas();

    // Estrutura nivel zero
    $scope.selectEstrutura = function(est){
        $('#listEstruturasIndicadores > li').remove();
        $('.efeitoLst').attr('efeito', 0);
        $('#comboMenuOpcoes').stop(true, true).slideToggle('fast');
        $('.fundoMenu').fadeToggle('fast');
        if(parseInt(est.ID)) {
            Factory.ajax(
                {
                    action: 'indicadores/estruturanivelzero',
                    data: {
                        ESTRUTURA_NIVEL_ZERO: est.ID
                    }
                },
                function () {
                    window.location = '#!/estruturas-de-indicadores';
                    Factory.updatePage();
                    $scope.getEstruturas();
                }
            );
        }
    };

    $scope.exibirDetalhamentoNivelzero = function () {
        $('#filtroAuxiliar .menu').addClass('active');
        $('#listEstruturasIndicadores li .menu').removeClass('active');
    };
    $scope.esconderDetalhamentoNivelzero = function () {
        if($('#filtroAuxiliar .menu').hasClass('active') || $('#listEstruturasIndicadores li .menu').hasClass('active')) {
            $('#filtroAuxiliar .menu').removeClass('active');
            $('#listEstruturasIndicadores li .menu').removeClass('active');
        }else
            $rootScope.swipeRight();
    };

    $scope.exibirMenu = function (registro) {
        $('#filtroAuxiliar .menu').removeClass('active');
        if (!$('#listEstruturasIndicadores li[data-id="' + registro.ID + '-' + registro.TIPO + '"] .menu').hasClass('active')) {
            $('#listEstruturasIndicadores li[data-id!="' + registro.ID + '-' + registro.TIPO + '"] .menu').removeClass('active');
            $('#listEstruturasIndicadores li[data-id="' + registro.ID + '-' + registro.TIPO + '"] .menu').addClass('active');
        }
    };

    $scope.esconderMenu = function (registro) {
        $('#filtroAuxiliar .menu').removeClass('active');
        if ($('#listEstruturasIndicadores li[data-id="' + registro.ID + '-' + registro.TIPO + '"] .menu').hasClass('active'))
            $('#listEstruturasIndicadores li[data-id="' + registro.ID + '-' + registro.TIPO + '"] .menu').removeClass('active');
    };

    $scope.EstruturasDeIndicadores = function(data){
        if(parseInt(Factory.PAGINACAO_INFINITO.OFFSET) && parseInt(Factory.PAGINACAO_INFINITO.ATIVO)){
            if(data.lstRegistros.length) {
                $.each(data.lstRegistros, function (idx, val) {
                    $scope.lstRegistros.push(val);
                });
            }else
                Factory.PAGINACAO_INFINITO.ATIVO = 0;
        }else {
            if(data.lstRegistros.length || $rootScope.criterio)
                $scope.lstRegistros = data.lstRegistros;

            // Set valores nizel zero
            $scope.ESTRUTURA_VAR_EXIBIR = parseInt(data.ESTRUTURA_VAR_EXIBIR) || 0;
            $scope.ESTRUTURA_ID = data.ESTRUTURA_ID;
            $scope.ESTRUTURA_COR = data.ESTRUTURA_COR;
            $scope.ESTRUTURA_VAR = data.ESTRUTURA_VAR;

            // Titulo
            $rootScope.subTitulo = 'Estrutura de indicadores';

            // Efeito
            setTimeout(function () {
                $('.efeitoLst').attr('efeito', 1);
            }, 50);
        }
        if(parseInt($routeParams.ID)) {
            // Titulo
            $rootScope.subTitulo = data.ESTRUTURA_NOME;
            $rootScope.subTituloMedicao = data.ESTRUTURA_VAR;
            $rootScope.subTituloSinal = data.ESTRUTURA_COR;

            $('#filtroAuxiliar ').hide();
            $('#toolbar .title').css('width','78%');
        }
    };
    $scope.EstruturasDeIndicadores(EstruturasDeIndicadoresData);

    Factory.updatePage = function(){
        Factory.ajax(
            {
                action: 'indicadores/estruturadeindicadores',
                data: {
                    ID: parseInt($routeParams.ID),
                    INDICADOR: parseInt($routeParams.INDICADOR)
                }
            },
            function (data) {
                $scope.EstruturasDeIndicadores(data);
            }
        );
    };

    $scope.getRegistro = function(registro){
        if(parseInt(registro.COUNT_FILHOS)) {
            if(registro.TIPO == 'ESTRUTURA')
                window.location = '#!/estruturas-de-indicadores/' + registro.ID;
            else
                window.location = '#!/estruturas-de-indicadores/' + registro.ESTRUTURA_PAI + '/' + registro.ID;
        }else
            window.location = '#!/indicadores-detalhes/'+registro.ID+'/'+registro.TIPO+'/ESTRUTURAS';
    };
});

app.controller('AnaliseJustificativaIndicador', function($rootScope, $scope, $routeParams, $mdSelect, AnaliseJustificativaIndicadorData) {
    var TELA = $routeParams.ORIGEM_COMPETENCIA ? $routeParams.ORIGEM_COMPETENCIA : null;
    Factory.$swipeLeftPageBefore = true;
    $('#tituloTop').hide();
    $('#subTituloTop').show();
    Factory.activeMenuBottom('indicadores');

    // Titulo
    if($routeParams.TIPO == "ANALISE")
        $rootScope.fraseTitulo = 'Análises e Justificativas ';
    else{
        $rootScope.fraseTitulo = 'Planos relacionados até ';
        $rootScope.centroSubTop = true;
    }

    // Get detalhes
    $scope.AnaliseJustificativaIndicador = function (data) {
        $rootScope.subTitulo = data.DADOS.NOME;
        // Dados
        $scope.DADOS = data.DADOS;

        // TIPO
        $scope.TIPO = $routeParams.TIPO;

        // Tipo
        $scope.ITEM = $routeParams.ITEM;

        //PERMITIR JUSTIFICATIVA APENAS AO RESPONSAVEL PELO INDICADOR
        if(!$scope.DADOS.PERMITIR_JUSTIFICATIVA)
            $scope.DADOS.DISABLED = true;

        //PERMITIR ACOES RAPIDAS
        if(data.DADOS.PERMITIR_ACOES_RAPIDAS == 0){
            setTimeout(function(){
                $('.adicionarAcaoRapida').hide();
                $('#modelo').hide();
            }, 100);
        }

		// Existe Analise
        $scope.existemAnalise = data.DADOS.existemAnalise;

        // Disabled
        setTimeout(function(){
            if(!data.DADOS.lstPlanoAcao.length)
                $('#tituloPlanoAcao').hide();
        }, 100);
    };
    $scope.AnaliseJustificativaIndicador(AnaliseJustificativaIndicadorData);

    // Abrir
    $scope.abrir = function (registro) {
        $rootScope.location('#!/planos-de-acao-detalhes/'+registro);
    };

    // Open relacionar
    $scope.openRelacionar = function () {
        $('#lstRelacionarPlanos').trigger('click');
    };
    $scope.adicionarPlanoAcao = function (DADOS) {
        $rootScope.ITEM = $scope.ITEM;
        $rootScope.PLANODEACAO = '';
        $rootScope.STATUS_ADD_EDT = null;
        $rootScope.location('#!/planos-de-acao-detalhes/0/'+DADOS.ID)
    };

	// removeAcaoRapida
    $scope.removeAcaoRapida = function (index, detalhes, acao) {
        if(parseInt(acao.ID)) {
            Factory.ajax(
                {
                    action: 'indicadores/removeaacaorapida',
                    data: {
                        ID: parseInt(acao.ID),
                        TIPO: 'ANALISE'
                    }
                },
                function (data) {
                    if (data.status == 1)
                        detalhes.ACOES_RAPIDAS.splice(index, 1);
                }
            );
        }else
            detalhes.ACOES_RAPIDAS.splice(index, 1);
    };

	
	// addAcaoRapida
	$scope.addAcaoRapida = function (detalhes) {
        if(!detalhes.ACOES_RAPIDAS)
            detalhes.ACOES_RAPIDAS = [];

        detalhes.ACOES_RAPIDAS.push([]);

        $('.scrollable-content').animate({scrollTop: 1300}, 'slow');
    };
	
	
	$scope.salvarAnalise = function(){
        setTimeout(function () {
            Factory.submit(
                $('#formAnalise'),
                function (data) {
                    $rootScope.backpageTop();
                }
            );
        }, 500);
    };
	
    // Voltar configuracoes
    Factory.updatePage = function(){
        $scope.ORIGEM_COMPETENCIA = $routeParams.ORIGEM_COMPETENCIA?'/'+$routeParams.ORIGEM_COMPETENCIA:'';
        Factory.ajax(
            {
                action: 'indicadores/detalhes',
                data: {
                    ID: parseInt($routeParams.ID),
                    ORIGEM_COMPETENCIA: $scope.ORIGEM_COMPETENCIA,
                    TIPO: 'ANALISE',
                    ITEM: $routeParams.ITEM
                }
            },
            function (data) {
                $scope.AnaliseJustificativaIndicador(data);
            }
        );
    };

    $scope.carregarLista = function(){
        Factory.ajax(
            {
                action: 'indicadores/relacionar',
                data: {
                    ID: parseInt($routeParams.ID),
                    PAI: ($scope.ITEM == 'INDICADOR')? 0 : 1,
                }
            },
            function (data) {
                $rootScope.PLANOSDEACAO_carregado = true;
                $rootScope.PLANOSDEACAO = data.PLANOSDEACAO;
                $rootScope.PLANOS_SELECTED = $.extend([], data.PLANOS_SELECTED);
                $rootScope.PLANOS_ORIGINAL = data.PLANOS_SELECTED;
            }
        );
    };
    $scope.salvarRelacionar = function(){
        Factory.ajax(
            {
                action: 'Indicadores/salvarrelacionar',
                data: {
                    ID: parseInt($routeParams.ID),
                    PLANOS: $rootScope.PLANOS_SELECTED,
                    PAI: ($scope.ITEM == 'INDICADOR')? 0 : 1,
                    PLANODEACAOORIGINAL: $rootScope.PLANOS_ORIGINAL

                }
            },
            function (data) {
                Factory.updatePage();
                $mdSelect.hide();
            }
        );
    };
});
