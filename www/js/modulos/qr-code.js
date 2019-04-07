app.controller('QrCode', function($rootScope, $scope) {
    $('#top').hide();
    $('#topTitulo').show();
    $rootScope.Titulo = 'Escaneia o código';
    $('html').attr('scan_qrcode', 1);
    $rootScope.show_body = true;
    try {
        QRScanner.scan(function (err, text) {
            if (err) {

            } else {
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
                        else
                            window.location = '#!/';
                    }
                );
            }
        });
        QRScanner.show();
    } catch (err) {
    }


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
    destroy: function () {
        $('html').attr('scan_qrcode', 0);
        try {
            QRScanner.destroy();
        } catch (err) {
        }
    }
};