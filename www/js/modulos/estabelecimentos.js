app.controller('EstabelecimentosLst', function($rootScope, $scope, $routeParams) {
    $rootScope.show_body = true;
    $('#top').hide();
    $('#topTitulo').show();
    $rootScope.Titulo = "Restaurantes";

    QRScannerConf.destroy();

    var timeoutGetLst = null;
    $scope.pesquisa = '';
    $scope.getLst = function(pesquisa) {
        if(timeoutGetLst)
            clearTimeout(timeoutGetLst);
        timeoutGetLst = setTimeout(function(){
            Factory.ajax(
                {
                    action: 'estabecimentos/lst',
                    data: {
                        Q: $scope.pesquisa,
                        MESA: $routeParams.MESA
                    }
                },
                function (data) {
                    $scope.LST = data.LST;
                }
            );
        }, pesquisa?1000:0);
    };
    $scope.getLst();

    $scope.clearPesquisa = function() {
        $scope.pesquisa = '';
        $scope.getLst();
    };

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