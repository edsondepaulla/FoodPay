app.controller('Estabelecimento', function($rootScope, $scope, $routeParams) {
    $rootScope.show_body = true;
    QRScannerConf.hide();
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