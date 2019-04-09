app.controller('EstabelecimentosFiltros', function($rootScope, $scope, $routeParams) {
    $rootScope.show_body = true;
    $('#top').hide();
    $('#topTitulo').show();
    $rootScope.Titulo = "Filtros";

    QRScannerConf.destroy();
});

app.controller('EstabelecimentosLst', function($rootScope, $scope, $routeParams) {
    $rootScope.show_body = true;
    $('#top').hide();
    $('#topTitulo').show();
    $rootScope.Titulo = "Restaurantes";

    QRScannerConf.destroy();

    var timeoutGetLst = null;
    $scope.getLst = function(pesquisa) {
        if(timeoutGetLst)
            clearTimeout(timeoutGetLst);
        timeoutGetLst = setTimeout(function(){
            Factory.ajax(
                {
                    action: 'estabecimentos/lst',
                    data: {
                        Q: $rootScope.pesquisa,
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
        $rootScope.pesquisa = '';
        $scope.getLst();
    };

    $scope.click = function(EST) {
        $rootScope.location('#!/estabelecimentos/' + EST.ID);
    };
});

app.controller('EstabelecimentosGet', function($rootScope, $scope, $routeParams) {
    $rootScope.show_body = true;
    $('#top').hide();
    $('#topTitulo').show();
    $rootScope.Titulo = "";

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
            $rootScope.Titulo = data.NOME;
        }
    );
});