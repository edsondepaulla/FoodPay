app.controller('EstabelecimentosLst', function($rootScope, $scope, $routeParams) {
    $rootScope.show_body = true;
    $('#top').show();
    $('#topTitulo').hide();
    QRScannerConf.destroy();
});

app.controller('EstabelecimentosGet', function($rootScope, $scope, $routeParams) {
    $rootScope.show_body = true;
    $('#top').show();
    $('#topTitulo').hide();
    QRScannerConf.destroy();
    Factory.ajax(
        {
            action: 'estabecimentos/get',
            data: {
                ID: $routeParams.ID
            }
        },
        function (data) {
            $scope.REG = data;
        }
    );
});