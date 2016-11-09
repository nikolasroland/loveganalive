
angular.module('starter.directives',[])


.directive('checkLoginState', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            element.bind('click', function(e) {
                if (!scope.loginState) {
                    scope.openLoginModal();
                    e.preventDefault();
                }
            })
        }
    };
})

.directive('checkBindDoctorCon', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            element.bind('click', function(e) {
                var doctorId = localStorage.getItem('doctorId');
                if (!doctorId) {
                    window.location.href='#/consult';
                    e.preventDefault();
                }else{
                    window.location.href='/consult/me-doctor-consult';
                    e.preventDefault();
                }
            })
        }
    };
})



.directive('checkBindDoctorRes', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            element.bind('click', function(e) {
                var doctorId = localStorage.getItem('doctorId');
                if (!doctorId) {
                    window.location.href='#/consult/me-doctor-search';
                    e.preventDefault();
                }else{
                    window.location.href='#/consult/me-doctor-info/{{doctorId}}';
                    e.preventDefault();
                }
            })
        }
    };
})

.filter('to_trusted', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    }
}])