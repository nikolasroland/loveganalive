angular.module('starter.directives', [])
    .directive('compareTo', [function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attr, ctrl) {
                var pwdWidget = elm.inheritedData('$formController')[attr.compareTo];

                ctrl.$parsers.push(function(value) {
                    if (value === pwdWidget.$viewValue) {
                        ctrl.$setValidity('match', true);
                        return value;
                    }

                    if (value && pwdWidget.$viewValue) {
                        ctrl.$setValidity('match', false);
                    }

                });

                pwdWidget.$parsers.push(function(value) {
                    if (value && ctrl.$viewValue) {
                        ctrl.$setValidity('match', value === ctrl.$viewValue);
                    }
                    return value;
                });
            }
        };
    }])

.directive('ionicDatepicker', ['$ionicPopup', function($ionicPopup) {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            ipDate: '=idate'
        },
        link: function(scope, element, attrs) {
            var monthsList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月",
                "八月", "九月", "十月", "十一月", "十二月"
            ];

            var currentDate = angular.copy(scope.ipDate);
            scope.weekNames = ['日', '一', '二', '三', '四', '五', '六'];

            scope.today = {};
            scope.today.dateObj = new Date();
            scope.today.date = (new Date()).getDate();
            scope.today.month = (new Date()).getMonth();
            scope.today.year = (new Date()).getFullYear();

            var refreshDateList = function(current_date) {
                currentDate = angular.copy(current_date);

                var firstDay = new Date(current_date.getFullYear(), current_date.getMonth(), 1).getDate();
                var lastDay = new Date(current_date.getFullYear(), current_date.getMonth() + 1, 0).getDate();

                scope.dayList = [];

                for (var i = firstDay; i <= lastDay; i++) {
                    var tempDate = new Date(current_date.getFullYear(), current_date.getMonth(), i);
                    scope.dayList.push({
                        date: tempDate.getDate(),
                        month: tempDate.getMonth(),
                        year: tempDate.getFullYear(),
                        day: tempDate.getDay(),
                        dateString: tempDate.toString(),
                        epochLocal: tempDate.getTime(),
                        epochUTC: (tempDate.getTime() + (tempDate.getTimezoneOffset() * 60 * 1000))
                    });
                }

                var firstDay = scope.dayList[0].day;

                for (var j = 0; j < firstDay; j++) {
                    scope.dayList.unshift({});
                }

                scope.rows = [];
                scope.cols = [];

                scope.currentMonth = monthsList[current_date.getMonth()];
                scope.currentYear = current_date.getFullYear();

                scope.numColumns = 7;
                scope.rows.length = 6;
                scope.cols.length = scope.numColumns;

            };

            scope.prevYear = function() {
                currentDate.setFullYear(currentDate.getFullYear() - 1);

                scope.currentMonth = monthsList[currentDate.getMonth()];
                scope.currentYear = currentDate.getFullYear();

                refreshDateList(currentDate)
            };

            scope.nextYear = function() {
                currentDate.setFullYear(currentDate.getFullYear() + 1);

                scope.currentMonth = monthsList[currentDate.getMonth()];
                scope.currentYear = currentDate.getFullYear();

                refreshDateList(currentDate)
            };

            scope.prevMonth = function() {
                if (currentDate.getMonth() === 1) {
                    currentDate.setFullYear(currentDate.getFullYear());
                }
                currentDate.setMonth(currentDate.getMonth() - 1);

                scope.currentMonth = monthsList[currentDate.getMonth()];
                scope.currentYear = currentDate.getFullYear();

                refreshDateList(currentDate)
            };

            scope.nextMonth = function() {
                if (currentDate.getMonth() === 11) {
                    currentDate.setFullYear(currentDate.getFullYear());
                }
                currentDate.setMonth(currentDate.getMonth() + 1);

                scope.currentMonth = monthsList[currentDate.getMonth()];
                scope.currentYear = currentDate.getFullYear();

                refreshDateList(currentDate)
            };

            scope.date_selection = {
                selected: false,
                selectedDate: '',
                submitted: false
            };

            scope.dateSelected = function(date) {
                scope.selctedDateString = date.dateString;
                scope.date_selection.selected = true;
                scope.date_selection.selectedDate = new Date(date.dateString);
            };

            element.on("click", function() {
                if (!scope.ipDate) {
                    var defaultDate = new Date();
                    refreshDateList(defaultDate);
                } else {
                    refreshDateList(angular.copy(scope.ipDate));
                }

                $ionicPopup.show({
                    templateUrl: 'templates/date-picker-modal.html',
                    title: '<strong>选择日期</strong>',
                    subTitle: '',
                    scope: scope,
                    buttons: [{
                        text: '关闭'
                    }, {
                        text: '今天',
                        onTap: function(e) {
                            var today = new Date();
                            refreshDateList(today);
                            scope.selctedDateString = today.toString();
                            scope.date_selection.selected = true;
                            scope.date_selection.selectedDate = today;
                            e.preventDefault();
                        }
                    }, {
                        text: '设置',
                        type: 'button-positive',
                        onTap: function(e) {
                            scope.date_selection.submitted = true;

                            if (scope.date_selection.selected === true) {
                                scope.ipDate = angular.copy(scope.date_selection.selectedDate);
                            } else {
                                e.preventDefault();
                            }
                        }
                    }]
                })
            })
        }
    }
}])
