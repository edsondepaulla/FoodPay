app.controller('MinhasAcoes', function($rootScope, $scope, $routeParams, MinhasAcoesData) {
    // Tab plano de acao
    $rootScope.TAB_PLANO_ACAO = null;

    // Menu direito
    $rootScope.MenuRight = [];

    //swipe-left
    $scope.exibirMenu = function (registro) {
        if(!$('li[data-id="'+registro.ID+'"] .menu').hasClass('active')){
            $('li[data-id!="'+registro.ID+'"] .menu').removeClass('active');
            $('li[data-id="'+registro.ID+'"] .menu').addClass('active');
        }
    };
    //swipe-right
    $scope.esconderMenu = function (registro) {
        if($('li[data-id="'+registro.ID+'"] .menu').hasClass('active'))
            $('li[data-id="'+registro.ID+'"] .menu').removeClass('active');
        else
            $rootScope.swipeRight();
    };

    Factory.$swipeLeftPageBefore = true;
    if(parseInt($routeParams.ID)) {
        $('#tituloTop').hide();
        $('#subTituloTop').show();
    }else{
        $('#tituloTop').show();
        $('#subTituloTop').hide();
    }
    Factory.activeMenuBottom('minhas-acoes');

	// Titulo
	$rootScope.titulo = 'Minhas ações';

	// Resposavel
    $.when(Login.get()).done(function (_return) {
        $('#top img').attr('src', _return.url_avatar);
        $scope.NOME = _return.NOME;
        $scope.EMAIL = _return.EMAIL;
    });

    // Abrir
    $scope.abrir = function (registro) {
        $rootScope.location('#!/minhas-acoes-detalhes/'+registro.ID);
    };

    // Get
    $scope.MinhasAcoesData = function (data) {
        // Lst
        $scope.lstRegistros = data.lstRegistros;

        // Efeito
        setTimeout(function(){
            $('.BlocolstMinhasAcoes').attr('efeito', 1);
        }, 500);
    };
    $scope.MinhasAcoesData(MinhasAcoesData);

    var _TIPO = null;
    var setTimeout_clear = null;
    Factory.updatePage = function(time) {
        setTimeout_clear = setTimeout(function(){
            Factory.ajax(
                {
                    action: 'acoes/lst',
                    data: {
                        TIPO: _TIPO.TIPO,
                        FILTROS: _TIPO.FILTROS
                    }
                },
                function (data) {
                    if(data.status == '1'){
                        if(parseInt(Factory.PAGINACAO_INFINITO.OFFSET) && parseInt(Factory.PAGINACAO_INFINITO.ATIVO)){
                            if(data.ITENS.length) {
                                $.each(data.ITENS, function (idx, val) {
                                    _TIPO.ITENS.push(val);
                                });
                            }else
                                Factory.PAGINACAO_INFINITO.ATIVO = 0;
                        }else {
                            if(!_TIPO.FILTROS)
                                _TIPO.FILTROS = data.FILTROS;

                            _TIPO.EXIBIR = data.EXIBIR;
                            if(data.ITENS.length || $rootScope.criterio)
                                _TIPO.ITENS = data.ITENS;

                            _TIPO.msgNenhumRegistros = data.msgNenhumRegistros;

                            // Efeito
                            setTimeout(function () {
                                $('.BlocolstMinhasAcoes').attr('efeito', 1);
                            }, 1);
                        }
                    }
                }
            );
        }, time?time:1);
    };

    $scope.carregaAba = function (tipo, time){
        clearTimeout(setTimeout_clear);
        _TIPO = tipo;
        Factory.PAGINACAO_INFINITO.PESQUISA = 1;
        Factory.PAGINACAO_INFINITO.ATIVO = 1;
        Factory.PAGINACAO_INFINITO.OFFSET = 0;
        $('.BlocolstMinhasAcoes').attr('efeito', 0);
        $('.BlocolstMinhasAcoes li').remove();
        Factory.updatePage(time);
    };

    $scope.filtroAcao = function (tipo, filtro) {
        filtro.ACTIVE = parseInt(filtro.ACTIVE)?0:1;
        $scope.carregaAba(tipo, 500);
    };
});

app.controller('AcoesDetalhes', function($rootScope, $scope, $routeParams, AcoesDetalhesData) {
    Factory.$swipeLeftPageBefore = true;
    $('#tituloTop').hide();
    $('#subTituloTop').show();
    Factory.activeMenuBottom('minhas-acoes');
    $rootScope.TAB_ACAO = 0;

    // Id acao
    $scope.ID_PARAMS = $routeParams.ID;
    $scope.ID = parseInt($routeParams.ID) || 0;

    $scope.format = 'DD/MM/YYYY';
    $scope.locale = {
        formatDate: function(date) {
            var m = moment(date);
            return m.isValid() && date ? m.format($scope.format) : '';
        }
    };

    // Get
    $scope.AcoesDetalhes = function (data) {
        $rootScope.subTitulo = $routeParams.ID == 'EDITAR' || parseInt($routeParams.ID)?'Detalhamento da ação':'Nova ação';
        if(parseInt($routeParams.ID)) {
            $scope.DADOS = data.DADOS;
            $rootScope.USUARIOS = data.DADOS.USUARIOS;
        }else{
            if(!data)
                data = [];
            data.PERMISSAO = true;
            data.PERMISSAO_REMOVER = true;
            $scope.DADOS = data;
            setTimeout(function(){
                $('md-tabs-wrapper').remove();
            }, 1);
        }
    };
    $scope.AcoesDetalhes(AcoesDetalhesData);

    // Excluir acao
    $scope.excluirAcao = function () {
        excluirAcao_callback = function() {
            if(parseInt($routeParams.ID)){
                Factory.ajax(
                    {
                        action: 'acoes/excluir',
                        form: $('#formAcao'),
                        data: {
                            ID: parseInt($routeParams.ID)
                        }
                    },
                    function (data) {
                        if(data.status == '1')
                            $scope.cancelarAcao();
                    }
                );
            }else{
                $rootScope.PLANODEACAO.ITENS.splice($scope.DADOS.KEY, 1);
                $scope.cancelarAcao();
            }
        }
        alertEdp('Deseja remover esta ação?', 'confirm', 'excluirAcao_callback');
    };

    // Salvar acao
    $scope.salvarAcao = function () {
        Factory.ajax(
            {
                action: 'acoes/form',
                form: $('#formAcao'),
                data: $.extend(
                    {
                        ID: parseInt($routeParams.ID),
                        ID_PLANO_ACAO: parseInt($routeParams.ID_PLANO_ACAO) || 0
                    },
                    parseInt($routeParams.ID)?
                        $('#formAcao').serializeArray():
                        $.extend(
                            {},
                            $scope.DADOS
                        )
                )
            },
            function (data) {
                if(data.status == '1') {
                    if(!parseInt($routeParams.ID)) {
                        if (!$rootScope.PLANODEACAO)
                            $rootScope.PLANODEACAO = [];

                        if (!$rootScope.PLANODEACAO.ITENS)
                            $rootScope.PLANODEACAO.ITENS = [];

                        if (typeof $scope.DADOS.KEY == 'undefined')
                            $rootScope.PLANODEACAO.ITENS.push(data.DADOS);
                        else
                            $rootScope.PLANODEACAO.ITENS[$scope.DADOS.KEY] = data.DADOS;
                    }
                    $scope.cancelarAcao();
                }
            }
        );
        return false;
    };

    $scope.cancelarAcao = function () {
        $rootScope.TAB_PLANO_ACAO = 1;
        setTimeout(function(){
            $rootScope.backpageTop();
        }, 1);
    };

    $scope.alterSliderStatus = function () {
        $scope.statusProcess(3, false);
        $scope.DADOS.CHANGE_PERCENTUAL = 1;
        if(!parseInt($scope.DADOS.PERCENTUAL || 0)) {
            $scope.DADOS.CHANGE_PERCENTUAL = 0;
            $('#OBSERVACAO').val('');
            $scope.DADOS.OBSERVACAO = '';
        }else if(parseInt($scope.DADOS.PERCENTUAL) == 100)
            $scope.statusProcess(4);
    };

    $scope.statusProcess = function (status, alterar_99_porc) {
        if($scope.DADOS.PERMISSAO) {
            var status_old = $scope.DADOS.STATUS;
            $scope.DADOS.STATUS = status;
            switch (status) {
                case 1:
                    if(alterar_99_porc !== false && status_old == 4)
                        $scope.DADOS.PERCENTUAL = 99;
                    $scope.DADOS.SLIDER_DISABLED = true;
                    $scope.DADOS.STATUS_LABEL = 'Em espera';
                    break;
                case 2:
                    if(alterar_99_porc !== false && status_old == 4)
                        $scope.DADOS.PERCENTUAL = 99;
                    $scope.DADOS.SLIDER_DISABLED = true;
                    $scope.DADOS.STATUS_LABEL = 'Para fazer';
                    break;
                case 4:
                    $scope.DADOS.PERCENTUAL = 100;
                    $scope.DADOS.CHANGE_PERCENTUAL = 1;
                    $scope.DADOS.SLIDER_DISABLED = false;
                    $scope.DADOS.STATUS_LABEL = 'Concluída';
                    break;
                case 3:
                    if(alterar_99_porc !== false && status_old == 4)
                        $scope.DADOS.PERCENTUAL = 99;
                    $scope.DADOS.SLIDER_DISABLED = false;
                    $scope.DADOS.STATUS_LABEL = 'Em andamento';
                    break;
            }
        }
    };

    Factory.updatePage = function(){

    };
});

app.controller('PlanoDeAcao', function($rootScope, $scope, $routeParams, PlanoDeAcaoData) {
    $rootScope.STATUS_ADD_EDT = null;
    Factory.$swipeLeftPageBefore = true;
    $('#tituloTop').show();
    $('#subTituloTop').hide();

    Factory.activeMenuBottom('minhas-acoes');

    // Plano de acao - variaveis
    $rootScope.PLANODEACAO = [];
    $rootScope.TAB_PLANO_ACAO = null;

    // Titulo
    $rootScope.titulo = 'Planos de ação';

    // Abrir
    $scope.abrir = function (registro) {
        $rootScope.location('#!/planos-de-acao-detalhes/'+registro.ID);
    };

    // Get
    $scope.PlanoDeAcao = function (data) {
        // Lst
        $scope.lstRegistros = data.lstRegistros;

        // Efeito
        setTimeout(function(){
            $('.BlocolstMinhasAcoes').attr('efeito', 1);
        }, 500);
    };
    $scope.PlanoDeAcao(PlanoDeAcaoData);

    var _TIPO = null;
    var setTimeout_clear = null;
    Factory.updatePage = function(time) {
        setTimeout_clear = setTimeout(function(){
            Factory.ajax(
                {
                    action: 'planosdeacao/lst',
                    data: {
                        TIPO: _TIPO.TIPO,
                        FILTROS: _TIPO.FILTROS
                    }
                },
                function (data) {
                    if(data.status == '1'){
                        if(parseInt(Factory.PAGINACAO_INFINITO.OFFSET) && parseInt(Factory.PAGINACAO_INFINITO.ATIVO)){
                            if(data.ITENS.length) {
                                $.each(data.ITENS, function (idx, val) {
                                    _TIPO.ITENS.push(val);
                                });
                            }else
                                Factory.PAGINACAO_INFINITO.ATIVO = 0;
                        }else {
                            if(!_TIPO.FILTROS)
                                _TIPO.FILTROS = data.FILTROS;

                            _TIPO.EXIBIR = data.EXIBIR;
                            if(data.ITENS.length || $rootScope.criterio)
                                _TIPO.ITENS = data.ITENS;

                            _TIPO.msgNenhumRegistros = data.msgNenhumRegistros;

                            // Efeito
                            setTimeout(function () {
                                $('.BlocolstMinhasAcoes').attr('efeito', 1);
                            }, 1);
                        }
                    }
                }
            );
        }, time?time:1);
    };

    $scope.carregaAba = function (tipo, time){
        clearTimeout(setTimeout_clear);
        _TIPO = tipo;
        Factory.PAGINACAO_INFINITO.PESQUISA = 1;
        Factory.PAGINACAO_INFINITO.ATIVO = 1;
        Factory.PAGINACAO_INFINITO.OFFSET = 0;
        $('.BlocolstMinhasAcoes').attr('efeito', 0);
        $('.BlocolstMinhasAcoes li').remove();
        Factory.updatePage(time);
    };

    $scope.filtroPlanoAcao = function (tipo, filtro) {
        filtro.ACTIVE = parseInt(filtro.ACTIVE)?0:1;
        $scope.carregaAba(tipo, 500);
    };
});

app.controller('PlanoDeAcaoDetalhes', function($rootScope, $scope, $routeParams, PlanoDeAcaoDetalhesData) {
    Factory.$swipeLeftPageBefore = true;
    $('#tituloTop').hide();
    $('#subTituloTop').show();
    Factory.activeMenuBottom('minhas-acoes');
    $rootScope.USUARIO_PERMISSAO = [];
    $rootScope.PODE_ADICIONAR = false;

    $scope.setAba = function (aba) {
        $rootScope.TAB_PLANO_ACAO = aba;
        if(aba != 0) {
            $('body[controller="PlanoDeAcaoDetalhes"] .md-tab').css('border', 0);
            $('body[controller="PlanoDeAcaoDetalhes"] md-ink-bar').show();
        }
    };

    //swipe-left
    $scope.exibirMenu = function (registro) {
        if(!$('li[data-id="'+registro.ID+'"] .menu').hasClass('active')){
            $('li[data-id!="'+registro.ID+'"] .menu').removeClass('active');
            $('li[data-id="'+registro.ID+'"] .menu').addClass('active');
        }
    };
    //swipe-right
    $scope.esconderMenu = function (registro) {
        if($('li[data-id="'+registro.ID+'"] .menu').hasClass('active'))
            $('li[data-id="'+registro.ID+'"] .menu').removeClass('active');
        else
            $rootScope.swipeRight();
    };
    // Id plano de acao
    $scope.ID_PLANO_ACAO = parseInt($routeParams.ID) || 0;

    // Get
    $scope.PlanoDeAcaoDetalhes = function (data) {
        if(parseInt($routeParams.ID)) {
            if(parseInt(data.DADOS.ID)) {
                // Titulo
                $rootScope.subTitulo = 'Editar plano de ação';

                $rootScope.PLANODEACAO = data.DADOS;
                $rootScope.USUARIOS = data.DADOS.USUARIOS;
            }else{
                $rootScope.backpageTop();
            }
        }else {
            $rootScope.TAB_PLANO_ACAO = 0;

            // Titulo
            $rootScope.subTitulo = 'Novo plano de ação';

            // Instancia plano de acao
            if(!$rootScope.PLANODEACAO)
                $rootScope.PLANODEACAO = [];

            // Permissao
            $rootScope.PLANODEACAO.PERMISSAO = true;
            $rootScope.PLANODEACAO.PERMISSAO_ACOES = true;
        }
    };
    $scope.PlanoDeAcaoDetalhes(PlanoDeAcaoDetalhesData);

    // Abrir
    $scope.abrirAcao = function (registro) {
        $rootScope.location('#!/minhas-acoes-detalhes/'+registro.ID);
    };

    $scope.formAcao = function (key, registro) {
        if(parseInt(registro.ID))
            $rootScope.location('#!/minhas-acoes-detalhes/'+registro.ID);
        else{
            registro.KEY = key;
            $rootScope.ACAO = $.extend({}, registro);
            $rootScope.location('#!/minhas-acoes-detalhes/EDITAR');
        }
    };

    $scope.salvarPlanoAcao = function() {
        if($rootScope.PLANODEACAO.PERMISSAO) {
            Factory.ajax(
                {
                    action: 'planosdeacao/form',
                    data: $.extend(
                        {
                            ID: parseInt($routeParams.ID),
                            ID_ITEM: parseInt($routeParams.ID_ITEM) || 0,
                            ITEM: $rootScope.ITEM?$rootScope.ITEM:''
                        },
                        parseInt($routeParams.ID) ?
                            $('#formPlanoDeAcao').serializeArray() :
                            $.extend(
                                {},
                                $rootScope.PLANODEACAO
                            )
                    )
                },
                function (data) {
                    if (data.status == '1') {
                        if(parseInt($routeParams.ID))
                            $rootScope.backpageTop();
                        else
                            $rootScope.location('#!/planos-de-acao-detalhes/' + data.ID);
                    } else
                        $rootScope.TAB_PLANO_ACAO = 0;
                }
            );
        }
        return false;
    };

    $scope.excluirPlanoAcao = function() {
        if($rootScope.PLANODEACAO.PERMISSAO) {
            excluirPlanoAcao_callback = function() {
                Factory.ajax(
                    {
                        action: 'planosdeacao/excluir',
                        form: $('#formPlanoDeAcao'),
                        data: {
                            ID: parseInt($routeParams.ID)
                        }
                    },
                    function (data) {
                        if (data.status == '1')
                            $rootScope.backpageTop();
                    }
                );
            }
            alertEdp('Deseja remover este plano de ação?', 'confirm', 'excluirPlanoAcao_callback');
        }
        return false;
    };

    $scope.addPermissao = function(){
        Factory.ajax(
            {
                action: 'planosdeacao/addpermissao',
                data: {
                    PLANOACAO: parseInt($rootScope.PLANODEACAO.ID),
                    USUARIO_PERMISSAO: $rootScope.USUARIO_PERMISSAO,
                    PODE_ADICIONAR: $rootScope.PODE_ADICIONAR
                }
            },
            function (data) {
                if(data.status == '1') {
                    $rootScope.PLANODEACAO.PERMISSOES = data.PERMISSOES;
                    $scope.cancelarPermissao();
                }
            }
        );
        return false;
    };

    $scope.exibirMenuPermissao = function (registro) {
        if(!$('#tableAcessos tr[data-id="'+registro.ID+'"] .menu').hasClass('active')){
            $('#tableAcessos tr[data-id!="'+registro.ID+'"] .menu').removeClass('active');
            $('#tableAcessos tr[data-id="'+registro.ID+'"] .menu').addClass('active');
        }
    };
    $scope.esconderMenuPermissao = function () {
        if($('#tableAcessos tr .menu').hasClass('active'))
            $('#tableAcessos tr .menu').removeClass('active');
    };

    $scope.alterPermissao = function(registro){
        Factory.ajax(
            {
                action: 'planosdeacao/alterpermissao',
                data: {
                    ID: parseInt(registro.ID),
                    PODE_ADICIONAR: registro.PODE_ADICIONAR
                }
            }
        );
    };

    $scope.removerPermissao = function(registro, key){
        excluirPermissao_callback = function() {
            Factory.ajax(
                {
                    action: 'planosdeacao/removerpermissao',
                    data: {
                        ID: parseInt(registro.ID)
                    }
                },
                function (data) {
                    if(data.status == '1')
                        $rootScope.PLANODEACAO.PERMISSOES.splice(key, 1);
                }
            );
        }
        alertEdp('Deseja remover esta permissão?', 'confirm', 'excluirPermissao_callback');
    };

    $scope.cancelarPermissao = function(){
        $rootScope.USUARIO_PERMISSAO = [];
        $rootScope.PODE_ADICIONAR = false;
        $('#PERMIITR_ADD_EDT_ACOES').attr('checked', false);
        $rootScope.hideModal('AddPermissao')
    };

    Factory.updatePage = function(){

    };
});
