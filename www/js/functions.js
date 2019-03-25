var Factory = {
    $http: null,
    $rootScope: [],
    $swipeLeftPageBefore: false,
    activeMenuBottom: function(menu){
        setTimeout(function(){
            $('#menu-bottom a').removeClass('active');
            $('#menu-bottom a[url="'+menu+'"]').addClass('active');
        }, 1);
    },
    PAGINACAO_INFINITO: {
        QUERY: '',
        ATIVO: 0,
        PESQUISA: 0,
        LIMIT: 10,
        OFFSET: 0
    },
    updatePage: function(){
		
    },
    submit: function(_this, successCallback){
        Factory.ajax(
            {
                action: _this.attr('action'),
                form: _this,
                data: _this.serializeArray()
            },
            successCallback
        );
    },
    ajax: function(params, successCallback, functionError) {
        if(params.action) {
            // Form
            var _form = params.form;

            // Data (parametros)
            var data = {
                'type-post': 'ajax',
                'app_plano': '1'
            };

            // Parametro versao app mobile
            if (config.versao_app_mobile)
                data['versao_app_mobile'] = config.versao_app_mobile;

            // Set data
            try {
                if (params.data) {
                    $.each(params.data, function (index, val) {
                        if (val.name && val.value)
                            data[val.name] = val.value;
                        else if (val) {
                            if(typeof val === 'object') {
                                data[index] = $.extend({}, val);
                                $.each(data[index], function (index2, val2) {
                                    if(typeof val2 === 'object')
                                        data[index][index2] = $.extend({}, val2);
                                });
                            }else
                                data[index] = val;
                        }
                    });
                }
            } catch (err) { }

            // Loading
            Pace.restart();
            if (_form)
                $('.btn-salvar').attr('disabled', true);
            /*
             * Paginacao infinito
             */
            $('.loadingLst').hide();
            if(parseInt(Factory.PAGINACAO_INFINITO.ATIVO) && parseInt(Factory.PAGINACAO_INFINITO.LIMIT)){
                if(Factory.PAGINACAO_INFINITO.OFFSET){
                    if(!$('.scrollable-content .loadingLst').length)
                        $('.scrollable-content').append('<span class="loadingLst"></span>');

                    $('.loadingLst').show();
                }

                data['PAG_LIMIT'] = Factory.PAGINACAO_INFINITO.LIMIT;
                data['PAG_OFFSET'] = Factory.PAGINACAO_INFINITO.OFFSET;
            }

            /*
             * Pesquisar - Query
             */
            if(Factory.$rootScope.criterio != '')
                data['PAG_QUERY'] = Factory.$rootScope.criterio;

            /*
             * Get Login - cookie
             */
            if(!parseInt(Login.get().ID)) {
                data['getLogin'] = 1;
                if(localStorage.getItem("PHPSESSID"))
                    data['PHPSESSID'] = localStorage.getItem("PHPSESSID");
            }

            // Request ajax
            return Factory.$http({
                method: 'POST',
                url: config.url_api[config.ambiente] + params.action,
                data: $.param(data),
                cache: false,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; text/html; charset=UTF-8'
                }
            })
                .then(function(response) {
                    setTimeout(function(){
                        $('.loadingLst').hide();
                    }, 100);
                    try {
                        if (Factory.$rootScope)
                            Factory.$rootScope.loading = false;

                        if (response.data.desconectado == 1) {
                            Login.set({});
                            if(params.action != 'login/logout')
                                window.location = "login.html";
                        } else {
                            // Login
                            if(response.data.Login) {
								if(response.data.VERIFICAR_AUTH){
									window.location = response.data.VERIFICAR_AUTH;
								}else{
									$('#carregando_sistema').remove();
									$('body').removeClass('verificando_login');
									$('body > .app').show();
									if(typeof response.data.Login.url_avatar == 'undefined')
										response.data.Login.url_avatar = '';
									Login.set(response.data.Login);
									Factory.$rootScope.usuarioLogado = response.data.Login;
								}
                            }

                            // PHPSESSID
                            if(response.data.PHPSESSID)
                                localStorage.setItem("PHPSESSID",response.data.PHPSESSID);

                            if (successCallback)
                                eval(successCallback)(response.data);
                        }

                        // Msg
                        if(response.data.msg && params.action != 'login/request')
                            alertEdp(response.data.msg, 'alert');

                        if (_form)
                            $('.btn-salvar').attr('disabled', false);

                        return response.data;
                    } catch (err) {
                        Factory.error(_form, err, functionError);
                    }
                }, function(data) {
                    setTimeout(function(){
                        $('.loadingLst').hide();
                    }, 100);
                    Factory.error(_form, data, functionError);
                });
        }
    },
    error: function(_form, data, functionError){
        $('#carregando_sistema').remove();
        $('body').removeClass('verificando_login');
        $('body > .app').show();

        if(Factory.$rootScope)
            Factory.$rootScope.loading = false;

        if (functionError)
            eval(functionError);

        if(data.status == '-1')
            window.location = '#!/sem-internet';
    }
};

function jsonGraficos(
    origem,
    data
){
    switch (origem){
        case 'PerformanceTimelineForecast':
            return {
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                xAxis: [{
                    categories: data.grafico.competencia_meses
                }],
                yAxis: [{
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
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> {point.y_name}: <b>{point.y_tooltip}</b><br/>'
                },
                legend: {
                    enabled: false,
                    borderWidth: 0,
                    shadow: true,
                    labelFormatter: function () {
                        return this.name;
                    }
                },
                series: data.grafico.data_series
            };
            break;
        case 'PerformanceTimelineCC':
            return {
                chart: {
                    type: 'column',
                    inverted: true
                },
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                xAxis: {
                    categories: data.grafico_cc.nomes,
                    labels: {
                        style: {
                            whiteSpace: 'nowrap'
                        },
                        padding: 0,
                        step: 1
                    }
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                tooltip: {
                    shared: true,
                    pointFormat: '<span style="color:{series.color};">{series.name}</span>: <b>{point.y_tooltip}</b><br/>'
                },
                series: [{
                    name: 'Valor',
                    data: data.grafico_cc.data_series
                }]
            };
            break;
        case 'PerformanceTimelineUnidade':
            var casa_decimal = data.grafico_unidade.data_series[0] ? data.grafico_unidade.data_series[0]['casas'] : 0;
            var select_graf = false;
            return {
                legend: {
                    enabled: false
                },
                title: {text: ''},
                credits: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: '<b>{point.percentage:.' + casa_decimal + 'f}%</b>'
                },
                exporting: {
                    enabled: false
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b><br>{point.y_tooltip}<br>{point.percentage:.' + casa_decimal + 'f}%',
                            style: {fontSize: '10px'}
                        }
                    },
                    series: {
                        cursor: 'pointer',
                        point: {
                            events: {
                                select: function () {
                                    select_graf = true;
                                    try {
                                        Factory.$rootScope.getConta(data.DADOS.ID_CONTA_FORECAST, this.id_unidade);
                                    }catch(err){ }
                                    setTimeout(function() {
                                        select_graf = false;
                                    }, 500);
                                },
                                unselect: function () {
                                    if(select_graf == false){
                                        try {
                                            Factory.$rootScope.getConta(data.DADOS.ID_CONTA_FORECAST, 0);
                                        }catch(err){ }
                                    }
                                    select_graf = false;
                                }
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    innerSize: '30%',
                    data: data.grafico_unidade.data_series
                }]
            };
            break;
        case 'IndicadoresDetalhar':
            return {
                title : {
                    text : ''
                },
                credits: {
                    enabled: false
                },
                xAxis : [{
                    categories: data.grafico.competencia_meses
                }],
                yAxis : [{
                    title:{ text : ''},
                    showFirstLabel : false,
                    showLastLabel: false,
                    opposite : true,
                    gridLineColor: '#e2e2e2'
                }, {
                    title:{ text : ''},
                    showFirstLabel : false,
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
                series: data.grafico.data_series
            };
            break;
        case 'PerformanceIndicadoresEconomicos':
            return {
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                exporting: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                xAxis: [{
                    categories: data.GRAFICO.competencia_meses
                }],
                yAxis: [{
                    visible: false,
                    title: {text: ''},
                    showFirstLabel: false,
                    showLastLabel: false,
                    opposite: true,
                    minRange: 6
                }, {
                    title: {text: ''},
                    visible: false,
                    showFirstLabel: false,
                    showLastLabel: false
                }],

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
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    shared: true,
                    pointFormat: '<span style="color:{point.color}; ">\u25CF</span> {series.name}: <b>{point.y_tooltip}'+data.FORMATO_PERCENTUAL+'</b><br/>'
                },
                series: data.GRAFICO.data_series
            };
            break;
        case 'PerformanceDREforecast':
            return {
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                xAxis: [{
                    categories: data.GRAF_CATEGORIES
                }],
                yAxis: [{
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
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> {point.y_name}: <b>{point.y_tooltip}</b><br/>'
                },
                legend: {
                    enabled: false,
                    borderWidth: 0,
                    shadow: true,
                    labelFormatter: function () {
                        return this.name;
                    }
                },
                series: data.GRAF
            };
            break;
        case 'PerformanceDREmensal':
            return {
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                xAxis: [{
                    categories: data.GRAF_CATEGORIES
                }],
                yAxis: [{
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
                    labelFormatter: function () {
                        return this.name;
                    }
                },
                series: data.GRAF
            };
            break;
        case 'PerformanceResumo':
            return {
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                exporting: {
                    enabled: false
                },
                xAxis: {
                    categories: [
                        ''
                    ]
                },
                yAxis: {
                    gridLineWidth: 0,
                    labels: {
                        enabled: false
                    },
                    title: {
                        text: ''
                    }
                },
                tooltip: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                series: data.GRAF
            };
            break;
    }
}

function onErrorUser(_this){
    _this.src = 'img/login_default.png';
}