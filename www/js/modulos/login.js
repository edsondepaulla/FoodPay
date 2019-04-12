var Login = {
    data: {
        ID: 0
    },
    set: function (data) {
        Login.data = data;
    },
    get: function () {
        return Login.data;
    }
};

app.controller('ConecteSe', function($rootScope, $scope, $routeParams) {
    if(parseInt(Login.get().ID)) {
        window.location = '#!/';
    }else{
        $rootScope.show_body = true;
        $('#top').show();
        $('#topTitulo').hide();
        QRScannerConf.destroy();

        $scope.comecar = function () {
            Factory.ajax(
                {
                    action: 'cadastro/usuario',
                    form: $('#conecteSe'),
                    data: {
                        DDI: '55',
                        CELULAR: $scope.CELULAR
                    }
                },
                function (data) {
                    if (data.status == '1') {

                    }
                }
            );
        };
    }
});

app.controller('ConecteSeCodigo', function($rootScope, $scope, $routeParams) {
    if($scope.CELULAR && $scope.CELULAR != '') {
        $rootScope.show_body = true;
        $('#top').hide();
        $('#topTitulo').show();
        $rootScope.Titulo = "Insira seu código";
        QRScannerConf.destroy();

        $scope.seguinte = function () {
            Factory.ajax(
                {
                    action: 'login/request',
                    form: $('#conecteSeCodigo'),
                    data: {
                        DDI: '55',
                        CELULAR: $scope.CELULAR,
                        CODIGO: $scope.CODIGO
                    }
                },
                function (data) {
                    if (data.status == '1') {

                    }
                }
            );
        };
    }else
        window.location = '#!/conecte-se';
});