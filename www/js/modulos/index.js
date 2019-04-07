app.controller('Index', function($rootScope, $scope) {
    $rootScope.show_body = false;
    QRScannerConf.destroy();
});
