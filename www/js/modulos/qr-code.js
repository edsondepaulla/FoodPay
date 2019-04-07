app.controller('QrCode', function($rootScope, $scope) {
    $('html').attr('scan_qrcode', 1);
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
});

var QRScannerConf = {
    hide: function () {
        $('html').attr('scan_qrcode', 0);
        try {
            QRScanner.hide();
        } catch (err) {
        }
    }
};