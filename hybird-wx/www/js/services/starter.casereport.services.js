var startServ = angular.module('starter.casereport.services',[])

startServ.factory('casereportservice',function($http,$q,$ionicPopup,$ionicLoading,$rootScope){
	return {
		hasmore:true,
		curPage:1,
		getcase: function(auth,userid){
			return _phppost('public/get_case',{
				auth: auth,
                userid:userid
			},$http,$q,$ionicPopup,$ionicLoading,$rootScope)
		}

	}
})

// startServ.factory('casereportDetailservice',['$http','$q','$ionicPopup','$ionicLoading','$rootScope',function($http,$q,$ionicPopup,$ionicLoading,$rootScope){
// 	praisePhp: function(auth, id) {
//          var deferred = $q.defer();
//          $ionicLoading.show();
//          $http.post(PHP_URL + 'public/praise_news', {
//                  auth: auth,
//                  id: id
//              })
//              .success(function(resp) {
//                  $ionicLoading.hide();
//                  if (resp.code === 200) {
//                      deferred.resolve(resp);
//                  } else {
//                      deferred.reject(resp)
//                      $ionicPopup.alert({
//                          title: '提示',
//                          template: resp.message
//                      });
//                  }
//              })
//              .error(function(resp) {
//                  $ionicLoading.hide();
//                  deferred.reject(resp)
//                  $ionicPopup.alert({
//                      title: '网络不给力',
//                      template: '<a style="text-align:center;" href="javascript:location.reload()">点击这里刷新再试试</a>',
//                      okText: '取消'
//                  });
//              })
//          return deferred.promise;
//      },
// })
