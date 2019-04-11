app.controller('Ajuda', function($rootScope, $scope, $routeParams) {
    $rootScope.show_body = true;
    $('#top').hide();
    $('#topTitulo').show();
    $rootScope.Titulo = "Ajuda";
    QRScannerConf.destroy();
});