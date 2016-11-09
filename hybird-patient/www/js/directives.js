"use strict";
angular.module('starter.directives', [])

.directive('numToChar', function() {
    return function(scope, elem, attrs) {
        scope.$watch(attrs.numToChar, function(value) {
            elem.text(String.fromCharCode(65 + value) + '.' + elem.text());
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

.directive('chatShowMenu', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            scope.$watch(attrs.chatShowMenu, function(value) {
                if (value) {
                    console.log(elem)
                    elem.css('bottom', '0px');
                } else {
                    elem.css('bottom', '-72px');
                }
            })
        }
    }
})

.filter('to_trusted', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    }
}])

.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            scope.$on('$ionicView.beforeEnter', function() {
                scope.$watch(attributes.hideTabs, function(value) {
                    $rootScope.hideTabs = value;
                });
            });

            scope.$on('$ionicView.beforeLeave', function() {
                scope.$watch(attributes.hideTabs, function(value) {
                    $rootScope.hideTabs = value;
                });
            });
        }
    };
})

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

.directive('sbLoad', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var fn = $parse(attrs.sbLoad);
            elem.on('load', function(event) {
                scope.$apply(function() {
                    fn(scope, { $event: event });
                });
            });
            elem.on('error', function(event) {
                scope.$apply(function() {
                    fn(scope, { $event: event });
                });
            });
        }
    };
}])

.directive('customOnChange', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var fn = $parse(attrs.customOnChange);
            elem.on('change', function(event) {
                scope.$apply(function() {
                    fn(scope, { $event: event });
                });
            });
        }
    };
}])

.directive('repeatDone', function() {
    return function(scope, element, attrs) {
        if (scope.$last) { // all are rendered
            scope.$eval(attrs.repeatDone);
        }
    }
})