var starterCtrl = angular.module('starter.casereport.controllers', [])

startCtrl.controller('casereportCtrl', function($scope, $rootScope, $location, localStorageService, casereportservice) {
    if (!window.localStorage.getItem('loginState')) {
        $rootScope.openLoginModal();
        return;
    }
    var auth = window.localStorage.getItem('auth');
    var userid = window.localStorage.getItem('patientId');
    casereportservice.getcase(auth, userid).then(function(resp) {
        $scope.list = resp;
    })

    $scope.viewDetail = function() {
        localStorageService.set('caseReportItem', this.item.data);
    }
})


startCtrl.controller('casereportDetailCtrl', function($scope, $location, localStorageService, casereportservice) {
    $scope.caseReportItem = localStorageService.get('caseReportItem');
})
