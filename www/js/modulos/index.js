app.controller('Index', function($rootScope, $scope, CompartilharData) {
    $('#subTituloTop').hide();
    $('#tituloTop').show();
    Factory.activeMenuBottom('');
    $rootScope.titulo = 'FoodPay';

    $rootScope.click = function(){
        var mapMaxZoom = 18;
        var geoloccontrol = new klokantech.GeolocationControl(map, mapMaxZoom);

        /*marker = new google.maps.Marker({
            map: map,
            draggable: true,
        });

        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){ // callback de sucesso
                    // ajusta a posição do marker para a localização do usuário
                    marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                },
                function(error){ // callback de erro
                    alert('Erro ao obter localização!');
                    console.log('Erro ao obter localização.', error);
                });
        } else {
            alert('Navegador não suporta Geolocalização!');
        }*/
    };

    // Menu direito
    /*$rootScope.MenuRight = [];

    // Remover compartilhar
    $scope.remover = function (key, DADOS) {
        removerCompartilhar_callback = function() {
            Factory.ajax(
                {
                    action: 'compartilhar/remover',
                    data: {
                        ID: DADOS.ID
                    }
                },
                function (data) {
                    if (data.status == '1')
                        $scope.lstRegistros.splice(key, 1);
                }
            );
        }
        alertEdp('Deseja remover?', 'confirm', 'removerCompartilhar_callback');
    };
    $scope.exibirMenu = function (registro) {
        if(!$('#lstCompartilhar li[data-id="'+registro.ID+'"] .menu').hasClass('active')){
            $('#lstCompartilhar li[data-id!="'+registro.ID+'"] .menu').removeClass('active');
            $('#lstCompartilhar li[data-id="'+registro.ID+'"] .menu').addClass('active');
        }
    };
    $scope.esconderMenu = function () {
        if($('#lstCompartilhar li .menu').hasClass('active'))
            $('#lstCompartilhar li .menu').removeClass('active');
        else
            $rootScope.swipeRight();
    };

    $scope.Index = function(data) {
        if(parseInt(Factory.PAGINACAO_INFINITO.OFFSET) && parseInt(Factory.PAGINACAO_INFINITO.ATIVO)){
            if(data.lstRegistros.length) {
                $.each(data.lstRegistros, function (idx, val) {
                    $scope.lstRegistros.push(val);
                });
            }else
                Factory.PAGINACAO_INFINITO.ATIVO = 0;
        }else if(data.lstRegistros.length)
            $scope.lstRegistros = data.lstRegistros;

        // Efeito
        setTimeout(function () {
            $('.efeitoLst').attr('efeito', 1);
        }, 500);
    };
    $scope.Index(CompartilharData);

    $scope.abrir = function (registro) {
        $rootScope.location('#!/compartilhar/'+registro.ID);
    };

    Factory.updatePage = function(){
        Factory.ajax(
            {
                action: 'compartilhar/lst'
            },
            function (data) {
                $scope.Index(data);
            }
        );
    };*/
});

app.controller('CompartilharForm', function($rootScope, $scope, $routeParams, CompartilharFormData) {
    $('#tituloTop').hide();
    $('#subTituloTop').show();
    Factory.activeMenuBottom('');
    $rootScope.subTitulo = '';

    // Menu direito
    $rootScope.MenuRight = [];

    // Id
    $scope.ID = parseInt($routeParams.ID) || 0;

    var $_registro = null;
    if(parseInt($routeParams.ID)) {
        if(parseInt(CompartilharFormData.DADOS.ID)) {
            $_registro = CompartilharFormData.DADOS.CONTEUDO;
            $scope.lstMsg = CompartilharFormData.MENSAGENS;
            $scope.DADOS = CompartilharFormData.DADOS;
            $rootScope.USUARIOS_SELECTED = $.extend([],CompartilharFormData.USUARIOS_SELECTED);
        }else {
            $rootScope.backpageTop();
            return;
        }
    }else {
        //$rootScope.COMPARTILHAR = JSON.parse(localStorage.getItem("COMPARTILHAR"));
        $_registro = $rootScope.COMPARTILHAR;
        $rootScope.USUARIOS_SELECTED = [];
    }

    if($_registro) {
        // Competencia
        if($_registro.COMPARTILHAR){
            if($_registro.COMPARTILHAR.COMPETENCIA) {
                moment.locale('pt');
                $_registro.COMPARTILHAR.COMPETENCIA_label = moment($_registro.COMPARTILHAR.COMPETENCIA).format('MMM/YYYY');
            }
        }

        // Registro
        $scope.registro = $_registro;
        switch ($_registro.ORIGEM){
            case 'PerformanceDREmensal':
                $scope.DADOS_MENSAL = $_registro;
                break;
            case 'PerformanceDREforecast':
                $scope.DADOS_FORECAST = $_registro;
                break;
            case 'PerformanceTimelineForecast':
                $scope.data = $_registro;
                break;
        }

        // Grafico
        setTimeout(function () {
            var name_graf = null;
            switch ($_registro.ORIGEM) {
                case 'PerformanceTimelineForecast':
                    name_graf = '#graf';
                    break;
                case 'PerformanceTimelineUnidade':
                    name_graf = '#graf_u';
                    break;
                case 'PerformanceTimelineCC':
                    name_graf = '#graf_cc';
                    break;
                case 'IndicadoresDetalhar':
                    name_graf = '#graf';
                    break;
                case 'PerformanceIndicadoresEconomicos':
                    $('#blocoCompartilhar #comboMenuOpcoes_' + $_registro.ID).show();
                    name_graf = '#grafico_' + $_registro.ID;
                    break;
                case 'PerformanceDREforecast':
                    name_graf = '#grafForecast';
                    break;
                case 'PerformanceDREmensal':
                    name_graf = '#grafMensal';
                    break;
                case 'PerformanceResumo':
                    name_graf = 'article[card-origem="' + $_registro.ORIGEM + '"] .blocoGrafExp .grafItemResumo';
                    break;
            }
            if (name_graf)
                $('#blocoCompartilhar ' + name_graf).highcharts(
                    jsonGraficos(
                        $_registro.ORIGEM,
                        $_registro
                    )
                );
                $('#blocoCompartilhar ' + name_graf).click(function () {
                    $('textarea').blur();
                });
        }, 800);

        // Open usuarios
        $scope.openUsuarios = function () {
            $('#lstUsuariosCompartilhar').trigger('click');
            setTimeout(function () {
                $('md-content').scrollTop(0);
            }, 100);
        };

        $scope.exibirMenu = function (msg) {
            if(!$('#lstMensagens li[data-id="'+msg.ID+'"] .menu').hasClass('active')){
                $('#lstMensagens li[data-id!="'+msg.ID+'"] .menu').removeClass('active');
                $('#lstMensagens li[data-id="'+msg.ID+'"] .menu').addClass('active');
            }
        };
        $scope.esconderMenu = function (msg) {
            if($('#lstMensagens li .menu').hasClass('active'))
                $('#lstMensagens li .menu').removeClass('active');
            else
                $rootScope.swipeRight();
        };

        // Remover Msg
        $scope.removerMsg = function (key, msg) {
            removerMsg_callback = function() {
                Factory.ajax(
                    {
                        action: 'compartilhar/removermsg',
                        data: {
                            ID: msg.ID
                        }
                    },
                    function (data) {
                        if (data.status == '1')
                            $scope.lstMsg.splice(key, 1);
                    }
                );
            }
            alertEdp('Deseja remover esta mensagem?', 'confirm', 'removerMsg_callback');
        };

        // Salvar
        $scope.salvar = function () {
            Factory.ajax(
                {
                    action: 'compartilhar/form',
                    data: {
                        ID: parseInt($routeParams.ID),
                        MENSAGEM: $('#MENSAGEM').val(),
                        USUARIOS_SELECTED: $rootScope.USUARIOS_SELECTED,
                        CONTEUDO: parseInt($routeParams.ID) ?
                            '' :
                            JSON.stringify($rootScope.COMPARTILHAR)
                    }
                },
                function (data) {
                    if(data.NAO_EXISTE_COMPARTILHAR == 1){
                        alertEdp('Registro removido!', 'alert');
                        $rootScope.backpageTop();
                    }else {
                        if (parseInt($routeParams.ID) && data.MENSAGEM) {
                            if (!$scope.lstMsg)
                                $scope.lstMsg = [];

                            $scope.lstMsg.unshift(data.MENSAGEM);
                        }

                        if (data.status == '1') {
                            if (!parseInt($routeParams.ID)) {
                                $rootScope.backpageTop();
                            } else {
                                $('#blocoCompartilhar').animate({
                                    scrollTop: 10000
                                }, 500);
                            }
                        }

                        if (data.status == '1')
                            $('#MENSAGEM').css('height', '35px').val('');
                    }
                }
            );
            return false;
        };
    }else{
        $rootScope.backpageTop();
        return;
    }
});