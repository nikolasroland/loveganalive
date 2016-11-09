var startServ = angular.module('starter.article.services',[])

startServ.factory('articleservice',function($http,$q,$ionicPopup,$ionicLoading,$rootScope){
	return {
		hasmore:true,
		curPage:1,
		reloadPhp: function(auth,type,page,limit){
			return _phppost('patient/get_news_list',{
				auth: auth,
                type: type,
                page: page,
                limit: limit
			},$http,$q,$ionicPopup,$ionicLoading,$rootScope)
		},
	}
	
})

startServ.factory('articledetailservice',function($http,$q,$ionicPopup,$ionicLoading,$rootScope){
	return {
		hasmore:true,
		curPage:1,
		reloadDetailPhp:function(auth,id){
			return _phppost('public/get_one_news',{
				auth: auth,
                id:id
			},$http,$q,$ionicPopup,$ionicLoading,$rootScope)
		}
	}
	})
