app.controller('Index', function($rootScope, $scope) {
    $rootScope.show_body = false;
    $('#top').show();
    $('#topTitulo').hide();
    QRScannerConf.destroy();
});
