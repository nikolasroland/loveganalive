'use strict';
angular.module('starter.directives', [])

.directive('numToChar', function() {
    return function(scope, elem, attrs) {
        scope.$watch(attrs.numToChar, function(value) {
            elem.text(String.fromCharCode(65 + value) + '、' + elem.text());
        })
    }
})

.directive('wrapLine', function() {
    return function(scope, elem, attrs) {
        scope.$watch(attrs.wrapLine, function(value) {
            if (value) {
                elem.html('');
                var txt = value.split('\n')
                for (var i in txt) {
                    elem.append('<p>' + txt[i] + '</p>');
                }
            }
        })
    }
})

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
                value = parseInt(value);
                element.html('');
                for (var i = 0; i < 5; i++) {
                    if (value - i >= 1) {
                        element.append('<span class="energized icon ion-ios-star"></span>')
                    } else if (value - i > 0) {
                        element.append('<span class="energized icon ion-ios-star-half"></span>')
                    } else {
                        element.append('<span class="energized icon ion-ios-star-outline"></span>')
                    }
                }
            }
        })
    }
})

.directive('separateDate', function() {
    return {
        restrict: 'ECMA',
        replace: true,
        transclud: true,
        scope: {
            prev: '@',
            curr: '@'
        },
        template: '<p style="font-size:18px;margin:5px 0 0 20px;color:#000;font-weight:bolder;">{{currFmtDate}}</p>',
        link: function(scope, element, attrs) {
            scope.currFmtDate = new Date(scope.curr.replace(/-/g, '/')).format('MM月dd日')
            scope.prevFmtDate = new Date(scope.prev.replace(/-/g, '/')).format('MM月dd日')
            if (scope.currFmtDate == scope.prevFmtDate) {
                element.html('');
            }
        }
    }
})

.directive('ngIfShowDate', function() {
    return function(scope, element, attrs) {
        scope.$watch(attrs.ngFmtDate, function(value) {
            if (value) {
                element.text(new Date(value).format('MM月dd日'));
            }
        })
    }
})

.filter('to_trusted', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    }
}])

.directive('quantity', function() {
    return {
        restrict: 'E',
        require: 'ngModel',
        replace: true,
        scope: {
            ngModel: '='
        },
        template: '<div class="quantity"><i ng-hide="ngModel<2" ng-click="minus()" class="ion-ios-minus-outline"></i> <span>{{ngModel}}</span> <i ng-click="plus()" class="ion-ios-plus-outline"></i></div>',
        link: function(scope, element, attrs) {
            scope.ngModel = 1;
            scope.minus = function() {
                scope.ngModel--;
            }
            scope.plus = function() {
                scope.ngModel++;
            }
        }
    }
})