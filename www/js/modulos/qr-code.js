app.controller('QrCode', function($rootScope, $scope) {
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


    $scope.flashAtivo = 0;
    $scope.flash = function(){
        if(!$scope.flashAtivo){
            $scope.flashAtivo = 1;
            try {
                QRScanner.enableLight();
            } catch (err) {
            }
        }else{
            $scope.flashAtivo = 0;
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