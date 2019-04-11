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
    $rootScope.show_body = true;
    $('#top').show();
    $('#topTitulo').hide();
    QRScannerConf.destroy();
});