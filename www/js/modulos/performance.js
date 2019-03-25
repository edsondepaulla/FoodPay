var Performance = {
    DETALHES: 'UNIDADE',
    MENU_RIGHT: [
        {
            titulo: 'Filtrar',
            url: '#!/performance-filtros'
        }
    ]
};

app.controller('Performance', function($rootScope, $scope, $routeParams, PerformanceData) {
    Factory.activeMenuBottom('performance');
    if (parseInt($routeParams.ID)) {
        Factory.$swipeLeftPageBefore = true;
        $rootScope.subTitulo = '';
        $('#tituloTop').hide();
        $('#subTituloTop').show();
    } else {
        Factory.$swipeLeftPageBefore = false;
        $('#tituloTop').show();
        $('#subTituloTop').hide();

        // Titulo
        $rootScope.titulo = 'Demonstração de resultado';
    }

    // Menu direito
    $rootScope.MenuRight = Performance.MENU_RIGHT;

    // Efeito
    if (parseInt($rootScope.SEMEFEITO))
        $rootScope.SEMEFEITO = null;
    else
        $scope.efeitoLst = 'efeitoLst';

    // Get contas
    $scope.Performance = function (data) {
        if(parseInt(Factory.PAGINACAO_INFINITO.OFFSET) && parseInt(Factory.PAGINACAO_INFINITO.ATIVO)){
            if(data.lstContas.length) {
                $.each(data.lstContas, function (idx, val) {
                    $scope.lstContas.push(val);
                });
            }else {
                Factory.PAGINACAO_INFINITO.OFFSET = 0;
                Factory.PAGINACAO_INFINITO.ATIVO = 0;
            }
        }else {
            // Lst contas
            if(data.lstContas.length || $rootScope.criterio)
                $scope.lstContas = data.lstContas;

            if (data.getConta) {
                $rootScope.centroSubTop = true;
                $rootScope.subTitulo = data.getConta.NOME;
                $rootScope.SEMEFEITO_ATIVAR = 1;
            }

            // Efeito
            if (!parseInt($rootScope.SEMEFEITO)) {
                setTimeout(function () {
                    $('.efeitoLst').attr('efeito', 1);
                }, 1);
            }
        }
    };
    $scope.Performance(PerformanceData);

    // Voltar configuracoes
    Factory.updatePage = function(){
        Factory.PAGINACAO_INFINITO.ATIVO = 1;
        Factory.ajax(
            {
                action: 'performance/dre/getcontas',
                data: {
                    ID: parseInt($routeParams.ID)
                }
            },
            function (data) {
                $scope.Performance(data);
            }
        );
    };

    // Click conta
    $scope.getConta = function (conta) {
        if (parseInt(conta.ULTIMONIVEL)) {
            $('.lstPerformance[tipo="CONTAS"] li[data-id!="'+conta.ID+'"] .menu').removeClass('active');
            $('.lstPerformance[tipo="CONTAS"] li[data-id="' + conta.ID + '"] .menu').addClass('active');
        }else
            $rootScope.location('#!/performance/' + conta.ID);
    };

    $scope.exibirMenu = function (conta) {
        if(!$('.lstPerformance[tipo="CONTAS"] li[data-id="'+conta.ID+'"] .menu').hasClass('active')){
            $('.lstPerformance[tipo="CONTAS"] li[data-id!="'+conta.ID+'"] .menu').removeClass('active');
            $('.lstPerformance[tipo="CONTAS"] li[data-id="'+conta.ID+'"] .menu').addClass('active');
        }
    };

    $scope.esconderMenu = function (conta) {
        if($('.lstPerformance[tipo="CONTAS"] li[data-id="'+conta.ID+'"] .menu').hasClass('active'))
            $('.lstPerformance[tipo="CONTAS"] li[data-id="'+conta.ID+'"] .menu').removeClass('active');
        else
            $rootScope.swipeRight();
    };
});

app.controller('PerformanceIndicadores', function($rootScope, $scope, $routeParams, PerformanceIndicadoresData) {
    Factory.activeMenuBottom('performance');
    if (parseInt($routeParams.ID)) {
        Factory.$swipeLeftPageBefore = true;
        $rootScope.subTitulo = '';
        $('#tituloTop').hide();
        $('#subTituloTop').show();
    } else {
        Factory.$swipeLeftPageBefore = false;
        $('#tituloTop').show();
        $('#subTituloTop').hide();

        // Titulo
        $rootScope.titulo = 'Indicadores econômicos';
    }

    // Menu direito
    $rootScope.MenuRight = Performance.MENU_RIGHT;

    // Get contas
    $scope.IndicadoresEcomicos = function (data) {
        // Lst indicadores
        $scope.lstIndicadores = data.lstIndicadores;

        // Efeito
        setTimeout(function(){
            $('.efeitoLst').attr('efeito', 1);
        }, 1);
    };
    $scope.IndicadoresEcomicos(PerformanceIndicadoresData);

    // Voltar configuracoes
    Factory.updatePage = function(){
        Factory.ajax(
            {
                action: 'performance/dre/getperformanceindicadores'
            },
            function (data) {
                $scope.IndicadoresEcomicos(data);
            }
        );
    };

    //click
    $scope.getIndicador = function (indicador) {
        $('#comboMenuOpcoes_'+indicador.ID).stop(true, true).slideToggle('medium');
        setTimeout(function () {
            if($('#comboMenuOpcoes_'+indicador.ID).is(':visible')) {
                $('#grafico_' + indicador.ID).highcharts(
                    jsonGraficos(
                        'PerformanceIndicadoresEconomicos',
                        indicador
                    )
                );
            }else{
                $('#grafico_' + indicador.ID).html('');
            }
        }, 500);
    };
});

app.controller('PerformanceFiltros', function($rootScope, $scope, $routeParams, PerformanceFiltrosData) {
    Factory.activeMenuBottom('performance');
    Factory.$swipeLeftPageBefore = false;
    $('#tituloTop').show();
    $('#subTituloTop').hide();

    // Menu direito
    $rootScope.MenuRight = Performance.MENU_RIGHT;

    // Titulo
    $rootScope.titulo = 'Filtros';

    // Select aba
    $scope.selectAba = function (filtro) {
        $rootScope.tab_filtros = filtro.TIPO;
        $scope.select(filtro, {});
    };

    // Get filtros
    $scope.PerformanceFiltros = function (data) {
        $scope.PREFILTRO_SELECIONADO = data.PREFILTRO_SELECIONADO;
        $scope.LSTPREFILTRO = data.LSTPREFILTRO;
        $scope.lstFiltros = data.lstFiltros;
    };
    $scope.PerformanceFiltros(PerformanceFiltrosData);

    $scope.exibirMenu = function (conta) {
        if(!$('body[controller="PerformanceFiltros"] #comboMenuOpcoes li[data-id="'+conta.ID+'"] .menu').hasClass('active')){
            $('body[controller="PerformanceFiltros"] #comboMenuOpcoes li[data-id!="'+conta.ID+'"] .menu').removeClass('active');
            $('body[controller="PerformanceFiltros"] #comboMenuOpcoes li[data-id="'+conta.ID+'"] .menu').addClass('active');
        }
    };

    $scope.esconderMenu = function (conta) {
        if($('body[controller="PerformanceFiltros"] #comboMenuOpcoes li[data-id="'+conta.ID+'"] .menu').hasClass('active'))
            $('body[controller="PerformanceFiltros"] #comboMenuOpcoes li[data-id="'+conta.ID+'"] .menu').removeClass('active');
    };

    // Atualiza pagina
    Factory.updatePage = function(){
        Factory.ajax(
            {
                action: 'configuracoes/getfiltros'
            },
            function (data) {
                $('.efeitoLst').attr('efeito', 0);
                $('.filtrosLst li').remove();
                $scope.PerformanceFiltros(data);
                setTimeout(function(){
                    $scope.selectAba($scope.lstFiltros[$rootScope.tab_filtros]);
                }, 1);
            }
        );
    };

    // Select pre filtro
    $scope.selectPrefiltro = function(PREFILTRO, EDITAR) {
        $('#comboMenuOpcoes').stop(true, true).slideToggle('fast');
        $('.fundoMenu').fadeToggle('fast');
        $('#comboMenu').html(PREFILTRO.NOME);
        $('#comboMenuOpcoes li').removeClass('active');
        $('#comboMenuOpcoes li[data-id="' + PREFILTRO.ID + '"]').addClass('active');
        Factory.ajax(
            {
                action: 'configuracoes/setprefiltro',
                data: {
                    IDPREFILTRO: parseInt(PREFILTRO.ID)
                }
            },
            function (data) {
                if (parseInt(EDITAR)) {
                    Factory.updatePage();
                }else
                    $rootScope.backpageTop(true);
            }
        );
    };

    // Remover pre filtro
    $scope.removerPrefiltro = function(PREFILTRO) {
        removerFiltro_callback = function() {
            $('#comboMenuOpcoes').stop(true, true).slideToggle('fast');
            $('.fundoMenu').fadeToggle('fast');
            $('#comboMenu').html('Todos');
            Factory.ajax(
                {
                    action: 'configuracoes/removerprefiltro',
                    data: {
                        IDPREFILTRO: parseInt(PREFILTRO.ID)
                    }
                },
                function (data) {
                    Factory.updatePage();
                }
            );
        }
        alertEdp('Deseja remover o pré-filtro: '+PREFILTRO.NOME+'?', 'confirm', 'removerFiltro_callback');
    };

    $scope.selectSwipe = function(filtro) {
        if (parseInt(filtro.SWIPE))
            $scope.select(filtro, {ID: filtro.NIVELSUPERIOR})
    };

    $scope.select = function(filtro, item) {
        if (!parseInt(item.ULTIMONIVEL) || (parseInt(item.ID) == 0 && filtro.TIPO != 'PROJETOS')) {
            setTimeout(function () {
                filtro.EXIBIR_BTN_VOLTAR = 0;
                filtro.NIVELSUPERIOR_NOME = '';
                filtro.ITENS = null;
                $('.topLst').hide();
                $('.comboFiltroLst[tipo="' + filtro.TIPO + '"] .filtrosLst li').remove();
                $('.comboFiltroLst[tipo="' + filtro.TIPO + '"] .filtrosLst').append('<span id="carregando">Carregando...</span>');
                Factory.ajax(
                    {
                        action: 'configuracoes/selectfiltro',
                        data: {
                            TIPO: filtro.TIPO,
                            ID: item.ID
                        }
                    },
                    function (data) {
                        $('.topLst').show();
                        $('.comboFiltroLst[tipo="' + filtro.TIPO + '"] .filtrosLst span').remove();
                        filtro.CHECKED_TODOS = data.FILTRO.CHECKED_TODOS;
                        filtro.NIVELSUPERIOR_NOME = data.FILTRO.NIVELSUPERIOR_NOME;
                        filtro.NIVELSUPERIOR = data.FILTRO.NIVELSUPERIOR;
                        filtro.SWIPE = data.FILTRO.SWIPE;
                        filtro.EXIBIR_BTN_VOLTAR = data.FILTRO.EXIBIR_BTN_VOLTAR;
                        filtro.ITENS = data.FILTRO.ITENS;
                        setTimeout(function () {
                            $('.efeitoLst').attr('efeito', 1);
                        }, 1);
                    }
                );
            }, 1);
        }
    };

    $scope.checked = function(filtro, item){
        item.CHECKED = !item.CHECKED;
        if(item.CHECKED)
            item.CHECKED_FILHOS = 0;
        var qtde_checked = 0;
        $.each(filtro.ITENS, function (index) {
            if(filtro.ITENS[index].CHECKED)
                qtde_checked++;
        });
        filtro.CHECKED_TODOS = filtro.ITENS.length == qtde_checked;

        // Atualiza filtro
        $scope.atualizaFiltro(filtro, parseInt(item.ID), filtro.CHECKED_TODOS, item.IDS_PAI);
    };

    $scope.checkedTodos = function(filtro){
        filtro.CHECKED_TODOS = !filtro.CHECKED_TODOS;

        var IDS_PAI = [];
        $.each(filtro.ITENS, function (index) {
            IDS_PAI = filtro.ITENS[index].IDS_PAI;
            filtro.ITENS[index].CHECKED = filtro.CHECKED_TODOS;
            if(filtro.ITENS[index].CHECKED)
                filtro.ITENS[index].CHECKED_FILHOS = 0;
        });

        // Atualiza filtro
        $scope.atualizaFiltro(filtro, 0, filtro.CHECKED_TODOS, IDS_PAI);
    };

    var atualizafiltroTimeout = [];
    $scope.atualizaFiltro = function(filtro, ID_CHECKED, CHECKED_TODOS, IDS_PAI){
        clearTimeout(atualizafiltroTimeout[filtro.TIPO]);
        atualizafiltroTimeout[filtro.TIPO] = setTimeout(function(){
            var _existe_filtro = false;
            $.each(filtro.FILTRO, function () {
                _existe_filtro = true;
                return;
            });
            if(!_existe_filtro) {
                ID_CHECKED = 0;
                filtro.FILTRO = {};
            }

            $.each(filtro.ITENS, function (index, vals) {
                if (parseInt(ID_CHECKED) ? ID_CHECKED == vals.ID : true) {
                    if (filtro.ITENS[index].CHECKED) {
                        if(vals.PROJETO_GRUPO != 1)
                            filtro.FILTRO[vals.ID] = vals.ID;

                        $.each(vals.FILHOS, function (id_filho) {
                            filtro.FILTRO[id_filho] = id_filho;
                        });
                    } else {
                        if(vals.PROJETO_GRUPO != 1)
                            delete filtro.FILTRO[vals.ID];

                        $.each(vals.FILHOS, function (id_filho) {
                            delete filtro.FILTRO[id_filho];
                        });
                    }
                }
            });

            try {
                $.each(IDS_PAI, function (ID_PAI) {
                    if(CHECKED_TODOS)
                        filtro.FILTRO[ID_PAI] = ID_PAI;
                    else
                        delete filtro.FILTRO[ID_PAI];
                });
            }catch(err){ }

            Factory.ajax(
                {
                    action: 'configuracoes/atualizafiltro',
                    data: {
                        TIPO: filtro.TIPO,
                        FILTRO: JSON.stringify(filtro.FILTRO)
                    }
                }
            );
        }, 1);
    };

    $scope.salvarPrefiltro = function(){
        var _input_nome = $('#formPreFiltro input[name="NOME"]');
        if(_input_nome.val().trim().length) {
            Factory.submit(
                $('#formPreFiltro'),
                function (data) {
                    Factory.updatePage();
                    Factory.$rootScope.hideModal('Filtro');
                    _input_nome.val('');
                    $('#comboMenuOpcoes').hide();
                }
            );
        }else
            _input_nome.focus();
    };

    $scope.cancelarPrefiltro = function(){
        $('#formPreFiltro input[name="NOME"]').val('');
    };
});

app.controller('PerformanceDetalhes', function($rootScope, $scope, $routeParams, PerformanceDetalhesData) {
    Factory.$swipeLeftPageBefore = true;
    $('#tituloTop').hide();
    $('#subTituloTop').show();
    $scope.ID = $routeParams.ID;
    Factory.activeMenuBottom('performance');

    // Menu direito
    $rootScope.MenuRight = Performance.MENU_RIGHT;

    $scope.PerformanceDetalhes = function (data, naoAtualizarGrafico) {
        if(parseInt(Factory.PAGINACAO_INFINITO.OFFSET) && parseInt(Factory.PAGINACAO_INFINITO.ATIVO)){
            if(data.lstRegistros.length) {
                $.each(data.lstRegistros, function (idx, val) {
                    $scope.lstRegistros.push(val);
                });
            }else {
                Factory.PAGINACAO_INFINITO.OFFSET = 0;
                Factory.PAGINACAO_INFINITO.ATIVO = 0;
            }
        }else {
            $scope.detalhesActive = data.detalhesActive;

            // Lst Detalhes
            $scope.lstDetalhes = data.lstDetalhes;

            // Lst registros
            $scope.lstRegistros = data.lstRegistros;

            // Filtro top
            $scope.ACUMULARATE = parseInt(data.ACUMULARATE) ? true : false;

            // Dados
            $scope.DADOS_MENSAL = data.DADOS_MENSAL;
            $scope.DADOS_FORECAST = data.DADOS_FORECAST;

            // Lst Detalhes
            $scope.lstDetalhes = data.lstDetalhes;

            // Lst registros
            $scope.lstRegistros = data.lstRegistros;

            // Subtitulo
            $rootScope.subTitulo = data.getConta.NOME;

            // Sem efeito
            $rootScope.SEMEFEITO_ATIVAR = 1;

            if (!parseInt(naoAtualizarGrafico)) {
                setTimeout(function () {
                    $('#grafMensal').highcharts(
                        jsonGraficos(
                            'PerformanceDREmensal',
                            data.DADOS_MENSAL
                        )
                    );

                    $('#grafForecast').highcharts(
                        jsonGraficos(
                            'PerformanceDREforecast',
                            data.DADOS_FORECAST
                        )
                    );
                }, 1000);
            } else {
                setTimeout(function () {
                    $('.lstPerformance.efeitoLst').attr('efeito', 1);
                }, 100);
            }
        }
    };
    $scope.PerformanceDetalhes(PerformanceDetalhesData);

    // Voltar configuracoes
    Factory.updatePage = function(naoAtualizarGrafico){
        Factory.PAGINACAO_INFINITO.ATIVO = 1;
        Factory.ajax(
            {
                action: 'performance/dre/get',
                data: {
                    ID: parseInt($routeParams.ID),
                    DETALHES: Performance.DETALHES
                }
            },
            function (data) {
                $scope.PerformanceDetalhes(data, naoAtualizarGrafico);
            }
        );
    };
    // Efeito
    setTimeout(function(){
        $('.efeitoLst').attr('efeito', 1);
        $('.lstPerformance.efeitoLst').attr('efeito', 1);
    }, 100);

    $scope.selectDetalhes = function(detalhes){
        $('.lstPerformance.efeitoLst').attr('efeito', 0);
        $('#comboMenuOpcoes').stop(true, true).slideToggle('fast');
        $('.fundoMenu').fadeToggle('fast');
        Performance.DETALHES = detalhes.TIPO;
        Factory.PAGINACAO_INFINITO.ATIVO = 1;
        Factory.PAGINACAO_INFINITO.OFFSET = 0;
        Factory.updatePage(1);
    };
});

app.controller('PerformanceResumo', function($rootScope, $scope, $routeParams, PerformanceResumoData) {
    Factory.$swipeLeftPageBefore = false;
    $('#tituloTop').show();
    $('#subTituloTop').hide();
    Factory.activeMenuBottom('performance');

    // Menu direito
    $rootScope.MenuRight = Performance.MENU_RIGHT;

    // Titulo
    $rootScope.titulo = 'Resumo da performance';

    // Get resumo
    $scope.PerformanceResumo = function (data) {
        // Filtro top
        $scope.ACUMULARATE = parseInt(data.ACUMULARATE)?true:false;
        $scope.COMPETENCIA = data.COMPETENCIA;
        $scope.LSTCOMPETENCIA = data.LSTCOMPETENCIA;
        $scope.COMPETENCIAREF = data.COMPETENCIAREF;
        $('#filtroTop').show();

        // Lst
        $scope.lstResumo = data.lstResumo;

        // Grafico
        setTimeout(function() {
            $.each(data.lstResumo, function (index, vals) {
                $('#lstResumo li[data-id="' + vals.ID + '"] .blocoGrafExp .grafItemResumo').highcharts(
                    jsonGraficos(
                        'PerformanceResumo',
                        vals
                    )
                );
            });
        }, 800);

        // Efeito
        setTimeout(function(){
            $('.efeitoLst').attr('efeito', 1);
        }, 1);
        Factory.activeMenuBottom('performance');
    };
    $scope.PerformanceResumo(PerformanceResumoData);

    // Voltar configuracoes
    Factory.updatePage = function(){
        Factory.ajax(
            {
                action: 'performance/dre/getresumo'
            },
            function (data) {
                $scope.PerformanceResumo(data);
            }
        );
    };
});

app.controller('PerformanceResumoLinhaDoTempo', function($rootScope, $scope, $routeParams, PerformanceResumoLinhaDoTempoData) {
    Factory.$swipeLeftPageBefore = true;
    $rootScope.subTitulo = 'Linha do tempo';
    $('.app')
    $('#tituloTop').hide();
    $('#subTituloTop').show();
    Factory.activeMenuBottom('performance');

    // Menu direito
    $rootScope.MenuRight = Performance.MENU_RIGHT;

    // Detalhes linha do tempo
    $scope.PerformanceResumoLinhaDoTempo = function (data, UNIDADE) {
        // Data
        $scope.data = data;

        // Detalhamento
        $scope.lstDetalhamento = data.lstDetalhamento;
        $('#blocoDetalhamento').css('display', data.lstDetalhamento.length ? 'block' : 'none');

        // Active
        setTimeout(function(){
            $('#blocoDetalhamento li').removeClass('active');
            $('#blocoDetalhamento li[data-id="'+data.DADOS.ID_CONTA_FORECAST+'"]').addClass('active');
        }, 1);

        // Grafico
        setTimeout(function(){
            $('#graf').highcharts(
                jsonGraficos(
                    'PerformanceTimelineForecast',
                    data
                )
            );
            if(UNIDADE === undefined) {
                $('#graf_u').highcharts(
                    jsonGraficos(
                        'PerformanceTimelineUnidade',
                        data
                    )
                );
            }
            $('#graf_cc').highcharts(
                jsonGraficos(
                    'PerformanceTimelineCC',
                    data
                )
            );
        }, 800);

        // Efeito
        setTimeout(function(){
            $('.efeitoLst').attr('efeito', 1);
        }, 1);
        Factory.activeMenuBottom('performance');
    };
    $scope.PerformanceResumoLinhaDoTempo(PerformanceResumoLinhaDoTempoData);

    $rootScope.getConta = function(CONTA, UNIDADE){
        Factory.ajax(
            {
                action: 'performance/dre/getresumolinhadotempo',
                data: {
                    ID: $routeParams.ID,
                    CONTA_DETALHES: parseInt($routeParams.CONTA),
                    CONTA: CONTA ? parseInt(CONTA.ID) : 0,
                    UNIDADE: parseInt(UNIDADE) || 0
                }
            },
            function (data) {
                $scope.PerformanceResumoLinhaDoTempo(data, UNIDADE);
            }
        );
    };
});