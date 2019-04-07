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

$(document).ready(function() {
    document.addEventListener("deviceready", function(){
        QRScanner.prepare(onDone); // show the prompt

        function onDone(err, status){
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
        }

        $('#scan_qrcode').click(function () {
            // Start a scan. Scanning will continue until something is detected or
// `QRScanner.cancelScan()` is called.
            QRScanner.scan(displayContents);

            function displayContents(err, text){
                if(err){
                    // an error occurred, or the scan was canceled (error code `6`)
                } else {
                    // The scan completed, display the contents of the QR code:
                    alert(text);
                }
            }

// Make the webview transparent so the video preview is visible behind it.
            QRScanner.show();
// Be sure to make any opaque HTML elements transparent here to avoid
// covering the video.


            
            /*cordova.plugins.barcodeScanner.scan(
                function (result) {
                    if (!result.cancelled) {
                        Factory.ajax(
                            {
                                action: 'qrcode/get',
                                data: {
                                    TEXT: result.text
                                }
                            },
                            function (data) {
                                if(data.status == 1)
                                    window.location = data.url;
                                else
                                    window.location = '#!/';
                            }
                        );
                    }
                },
                function (error) {
                    alert("Scanning failed: " + error);
                },
                {
                    preferFrontCamera : false, // iOS and Android
                    showFlipCameraButton : false,// iOS and Android
                    showTorchButton : true,// iOS and Android
                    torchOn: false, // Android, launch with the torch switched on (if available)
                    saveHistory: false, // Android, save scan history (default false)
                    prompt: "", // Android
                    resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                    formats : "QR_CODE",// default: all but PDF_417 and RSS_EXPANDED
                    orientation : "portrait",// Android only (portrait|landscape), default unset so it rotates with the device
                    disableAnimations : false, // iOS
                    disableSuccessBeep: false // iOS and Android
                }
            );*/
        });
    }, false);
});