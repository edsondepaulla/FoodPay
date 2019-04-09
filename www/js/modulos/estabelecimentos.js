app.controller('EstabelecimentosLst', function($rootScope, $scope, $routeParams) {
    $rootScope.show_body = true;
    $('#top').hide();
    $('#topTitulo').show();
    $rootScope.Titulo = "Restaurantes";

    QRScannerConf.destroy();
    Factory.ajax(
        {
            action: 'estabecimentos/lst',
            data: {
                MESA: $routeParams.MESA
            }
        },
        function (data) {
            $scope.LST = data.LST;
        }
    );


    $scope.click = function(EST) {
        $rootScope.location('#!/estabelecimentos/' + EST.ID);
    };
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