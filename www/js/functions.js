var Factory = {
    $http: null,
    $rootScope: [],
    $swipeLeftPageBefore: false,
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

                        if (response.data.desconectado == 1 && false) {
                            Login.set({});
                            if(params.action != 'login/logout')
                                window.location = "login.html";
                        } else {
                            // Login
                            if(response.data.Login) {
								if(response.data.VERIFICAR_AUTH){
									window.location = response.data.VERIFICAR_AUTH;
								}else{
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
                            alert(response.data.msg);

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
        if(Factory.$rootScope)
            Factory.$rootScope.loading = false;

        if (functionError)
            eval(functionError);

        if(data.status == '-1')
            window.location = '#!/sem-internet';
    }
};

function onErrorUser(_this){
    _this.src = 'img/login_default.png';
}

function onErrorEstabelecimento(_this){
    _this.src = 'img/login_default.png';
}

document.addEventListener("deviceready", function(){
    cordova.plugins.notification.local.requestPermission(function (granted) {

    });
}, false);

$(document).ready(function() {
    /*cordova.plugins.notification.local.schedule({
        title: 'My first notification 22222',
        text: 'Thats pretty easy...',
        foreground: true
    });
    setTimeout(function(){
        cordova.plugins.notification.local.schedule({
            title: 'My first notification 444444',
            text: 'Thats pretty easy...',
            foreground: true
        });
    }, 30000);*/

    try {
        QRScanner.prepare(function (err, status) {
            if (err) {
                // here we can handle errors and clean up any loose ends.
                console.error(err);
            }
            if (status.authorized) {
                // W00t, you have camera access and the scanner is initialized.
                // QRscanner.show() should feel very fast.
            } else if (status.denied) {
                // The video preview will remain black, and scanning is disabled. We can
                // try to ask the user to change their mind, but we'll have to send them
                // to their device settings with `QRScanner.openSettings()`.
            } else {
                // we didn't get permission, but we didn't get permanently denied. (On
                // Android, a denial isn't permanent unless the user checks the "Don't
                // ask again" box.) We can ask again at the next relevant opportunity.
            }
        });
    } catch (err) {
    }
});