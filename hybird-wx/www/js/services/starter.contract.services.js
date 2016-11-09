var startServ = angular.module('starter.contract.services',[])

startServ.factory('contractervice',['$http','$q','$ionicPopup','$ionicLoading','$rootScope',function($http,$q,$ionicPopup,$ionicLoading,$rootScope){
	return {
		reloadContract: function(orderCode){
			return _javapost('trade/app/findByOrderCodePhp.htm',{
				sign: '1b255a1f2d3bae64926da7106ef06ce2',
                orderCode: orderCode
			},$http,$q,$ionicPopup,$ionicLoading,$rootScope)
		},
		buy: function(jsonData){
			return _javapost('trade/app/prepayIdHfiveOnline.htm',{
				sign: '425c0e434464a3806c8b78b9fe386d5b',
                jsonData: jsonData
			},$http,$q,$ionicPopup,$ionicLoading,$rootScope)
		},
		getProductDetail: function(){
			return _javapost('product/app/getContractServiceProduct.htm', {
                sign: '4f691c39dab984ddc78c66bf288710b1',
                doctorUserId: 0
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
		},
        getOpenid: function(code) {
            return _javapost('trade/app/getAccessTokenCode.htm', {
                sign: '6f261a19475fff21d2feadb5d1659f27',
                code: code
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
	}
}])

