app.controller('QrCode', function($rootScope, $scope) {
    $('#top').hide();
    $('#topTitulo').show();
    $rootScope.Titulo = 'Escaneia o código';
    $('html').attr('scan_qrcode', 1);
    $rootScope.show_body = true;

    QRScannerConf.show();

    $scope.digite = function() {
        try {
            navigator.notification.prompt(
                'Está localizado na mesa ou comanda',
                function (results) {
                    if (results.buttonIndex == 1) {
                        if(results.input1.length)
                            QRScannerConf.scan(results.input1);
                        else
                            return false;
                    }
                },
                'Escreva o código',
                ['Continue', 'Cancelar'],
                ''
            );
        } catch (err) {
            var text = prompt("Escreva o código que está localizado na mesa ou comanda", "");
            if (text != null)
                QRScannerConf.scan(text);
        }
    };

    $scope.flashAtivo = 'on';
    $scope.flashTexto = 'Acenda';
    $scope.flash = function(){
        if($scope.flashAtivo == 'on'){
            $scope.flashAtivo = 'off';
            $scope.flashTexto = 'Apague';
            try {
                QRScanner.enableLight();
            } catch (err) {
            }
        }else{
            $scope.flashAtivo = 'on';
            $scope.flashTexto = 'Acenda';
            try {
                QRScanner.disableLight();
            } catch (err) {
            }
        }
    };
});

var QRScannerConf = {
    show: function () {
        try {
            QRScanner.scan(function (err, text) {
                if (err) {

                } else {
                    QRScannerConf.scan(text, 1);
                }
            });
            QRScanner.show();
        } catch (err) {
        }
    },
    destroy: function () {
        $('html').attr('scan_qrcode', 0);
        try {
            QRScanner.destroy();
        } catch (err) {
        }
    },
    scan: function(text, qrcode){
        if(text.length) {
            Factory.ajax(
                {
                    action: 'qrcode/get',
                    data: {
                        TEXT: text
                    }
                },
                function (data) {
                    if (data.status == 1)
                        window.location = data.url;
                    else{
                        if(qrcode) {
                            try {
                                QRScanner.destroy();
                                QRScannerConf.show();
                            } catch (err) {
                            }
                        }
                        try {
                            navigator.notification.alert(
                                'Código inválido!',
                                'Mensagem',
                                'Algo de errado'
                            );
                        } catch (err) {
                            alert('Código inválido!');
                        }
                    }
                }
            );
        }
    }
};