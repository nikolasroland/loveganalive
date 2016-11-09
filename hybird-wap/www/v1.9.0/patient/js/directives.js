'use strict';
angular.module('starter.directives', [])

.directive('formatDate', function($filter) {
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ngModelCtrl) {
            ngModelCtrl.$formatters.push(function(modelValue) {
                if (modelValue) {
                    return new Date(modelValue);
                }
            });

            ngModelCtrl.$parsers.push(function(value) {
                if (value) {
                    return $filter('date')(value, 'yyyy-MM-dd');
                }
            });
        }
    };
})

.directive('ngStar', function() {
    return function(scope, element, attrs) {
        scope.$watch(attrs.ngStar, function(value) {
            if (value) {
                for (var i = 0; i < 5; i++) {
                    if (value - i >= 1) {
                        element.append('<span class="energized icon ion-ios-star"></span>')
                    }
                    else if (value - i > 0) {
                        element.append('<span class="energized icon ion-ios-star-half"></span>')
                    }
                    else{
                        element.append('<span class="energized icon ion-ios-star-outline"></span>')
                    }
                }
            }
        })
    }
})
