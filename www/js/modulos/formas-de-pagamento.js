app.controller('FormasDePagamento', function($rootScope, $scope) {
    $('#top').show();
    $('#topTitulo').hide();
    $rootScope.show_body = true;
    QRScannerConf.destroy();
});