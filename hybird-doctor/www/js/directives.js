'use strict';
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
                element.html('');   
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

.directive('accordion', function() {
                return {
                    restrict : 'EA',
                    replace : true,
                    transclude : true,
                    template : '<div ng-transclude></div>',
                    controller : function() {
                        var expanders = [];
                        this.gotOpened = function(selectedExpander) {
                            angular.forEach(expanders, function(expander) {
                                if (selectedExpander != expander) {
                                    expander.showMe = false;
                                }
                            });
                        }
                        this.addExpander = function(expander) {
                            expanders.push(expander);
                        }
                    }
                }
            })

.directive('expander', function() {
                return {
                    restrict : 'EA',
                    replace : true,
                    transclude : true,
                    require : '^?accordion',
                    scope : {
                        title : '=expanderTitle'
                    },
                    template : '<div>'
                              + '<div class="title" ng-click="toggle()">{{title}}</div>'
                              + '<div class="body" ng-show="showMe" ng-transclude></div>'
                              + '</div>',
                    link : function(scope, element, attrs, accordionController) {
                        scope.showMe = false;
                        accordionController.addExpander(scope);
                        scope.toggle = function toggle() {
                            scope.showMe = !scope.showMe;
                            accordionController.gotOpened(scope);
                        }
                    }
                }
            })

.filter('to_trusted', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    }
}])

