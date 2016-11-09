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
/*
.directive('test', function() {
    return {
        restrict: 'ECMA',
        replace: true,
        transclud: true,
        template: '<div id="actTop" class="act-top" style="-webkit-clip-path: polygon({{points}});"><div class="act-padding"><b class="act-left act-white">问题{{'一'}}：</b><b class="act-right act-white">({{'1'}}/{{'10'}})</b></div><div class="act-padding"><p class="act-subject">{{'丙肝患者的发病有急性发作，也有慢性发作，症状表现也是不同的。处于慢性发病期间的患者可常年无任何症状，就由专家具体讲解丙肝有什么临床诊断方法?'}}</p></div></div>',
        link: function(scope, element, attrs) {
            scope.$watch(attrs.subject, function(value) {
                if (value) {
                    var height = element.offsetHeight;
                    var pArr = [];
                    pArr.push('0px 0px');
                    pArr.push(screen.width + 'px 0px');
                    pArr.push(screen.width + 'px ' + (height - 50) + 'px');
                    pArr.push('0px ' + (height) + 'px');
                    $scope.points = pArr.join(',');
                    // element.text(new Date(value).format('MM月dd日'));
                }
            })
        }
    }
})*/

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
