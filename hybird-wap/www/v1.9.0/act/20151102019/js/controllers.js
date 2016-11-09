'use strict';
angular.module('starter')

.animation('.repeat-animation', function() {
    return {
        enter: function(element, done) {
            element.children(2).css({
                opacity: 0
            });
            element.children(2).animate({
                opacity: 1
            }, done);
        }
    };
})

.animation('.hide-animation', function() {
    return {
        beforeAddClass: function(element, className, done) {
            if (className === 'ng-hide') {
                element.animate({
                    opacity: 0
                }, 500, done);
            } else {
                done();
            }
        },
        removeClass: function(element, className, done) {
            if (className === 'ng-hide') {
                //element.css('opacity', 0);
                element.animate({
                    opacity: 1
                }, 500, done);
            } else {
                done();
            }
        }
    };
})

angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $rootScope, $ionicHistory, $ionicPopup, $ionicPlatform, Serv) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.uid = window.location.search.substr(5);
    $scope.start = function() {
        if ($scope.uid == '' || $scope.uid == 0 || window.localStorage.getItem('userId') == '' || window.localStorage.getItem('userId') == 0 || window.localStorage.getItem('userId') == null ) {
            $ionicPopup.alert({
                title: '提示',
                template: '需要先登录爱肝一生app才可以答题哦'
            }).then(function() {
                window.parent.postMessage({
                    func: 'run',
                    params: ['login', []]
                }, '*');
            });
        } else {
            window.parent.postMessage({
                func: 'getAuth',
                params: ['patient']
            }, '*')
        }
    }
})

.controller('QuestionsCtrl', function($scope, $rootScope, $timeout, $ionicHistory, $ionicScrollDelegate, $location, $ionicPopup, $ionicPlatform, Serv) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.uid = window.location.search.substr(5);

    var colorArr = [
        ['#189ec1', '#97e9ff'],
        ['#ff6418', '#ffac83'],
        ['#ffbb18', '#ffdd8b'],
        ['#51c567', '#88ff9f'],
        ['#ff9037', '#ffcfa8']
    ];
    var _getRandomColor = function() {
        var _color = colorArr[Math.floor(Math.random() * colorArr.length)];
        $scope.bgColor = {
            'backgroundColor': _color[0]
        };
        $scope.foreColor = {
            'backgroundColor': _color[1]
        };
    }

    $scope.isFirst = false;
    $scope.isAnalyze = false;
    $scope.isStart = false;
    $scope.isResult = false;
    $scope.isEnter = false;

    function randomsort(a, b) {
        return Math.random() > .5 ? -1 : 1;
    }

    Serv.reloadQuestions().then(function(resp) {
        $scope.isEnter = true;
        if (resp.code == 514) {
            $scope.isFirst = false;
            $scope.isStart = false;
            $scope.isResult = true;
            $scope.result = resp.data;
            return;
        }
        $scope.isStart = true;
        $scope.isFirst = true;
        resp.list.forEach(function(item) {
            item.choice = 'empty';
            // type
            if (item.type == 2) {
                item.question += '（多选）';
            }

            item.selected = [];
            item.sel = [];
            // options
            item.opts = [];
            for (var i in item.option) {
                item.opts.push([i, item.option[i]]);
            }
            item.opts = item.opts.sort(randomsort);

            // analyze
            item.analyzeOpts = [];
            var answerArr = item.answer.split(',');
            for (var i = 0; i < item.opts.length; i++) {

                if (answerArr.indexOf(item.opts[i][0]) > -1) {
                    item.analyzeOpts.push([i, item.opts[i]]);
                }
            }

        });
        $scope.list = resp.list.sort(randomsort);
        $scope.len = resp.list.length;

        $scope.curr = 0;
        $scope.startTime = Date.now().toString().substr(0, 10);

        $scope.subNo = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'];
        $scope.answer = [];

        var _startTime = (Date.now() / 1000);
        var clock = function() {
            if ($scope.isResult) return;
            var _timer = parseInt(Date.now().toString().substr(0, 10)) - parseInt($scope.startTime);
            if (_timer > 3600) {
                $ionicPopup.alert({
                    title: '您未能在规定时间内答完所有题目',
                    okText: '重新答题'
                }).then(function() {
                    window.location.reload();
                })
                return;
            }
            var _min = 59 - Math.floor(_timer / 60);
            var _sec = 59 - _timer % 60;
            _sec = _sec < 10 ? '0' + _sec : _sec;
            $scope.timer = _min + ':' + _sec;
            $timeout(clock, 1000);
        }
        clock();
    });


    $scope.prev = function() {
        $scope.isResult || $scope.answer.pop();
        $scope.curr--;
        _getRandomColor();
        $scope.$broadcast('scroll.resize');
        $scope.scrollToMain();
    }

    $scope.next = function(id, choice) {
        $scope.curr++;
        $scope.isResult || $scope.answer.push(id + '-' + choice);
        _getRandomColor();
        $scope.$broadcast('scroll.resize');
        $scope.scrollToMain();
    }

    $scope.isSelected = function(id) {
        return $scope.list[$scope.curr].selected.indexOf(id) >= 0;
    }

    var updateSelected = function(action, id) {
        if (action == 'add' && $scope.list[$scope.curr].sel.indexOf(id) == -1) {
            $scope.list[$scope.curr].sel.push(id);
            $scope.list[$scope.curr].choice = $scope.list[$scope.curr].sel.join(',');
        }
        if (action == 'remove' && $scope.list[$scope.curr].sel.indexOf(id) != -1) {
            var idx = $scope.list[$scope.curr].sel.indexOf(id);
            $scope.list[$scope.curr].sel.splice(idx, 1);
            $scope.list[$scope.curr].choice = $scope.list[$scope.curr].sel.join(',');
        }
    }

    $scope.updateSelection = function($event, id) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    }

    $scope.submit = function(id, choice) {
        _getRandomColor();
        $scope.answer.push(id + '-' + choice);
        var result = $scope.answer.join('|');
        Serv.saveAnswer(result, $scope.startTime).then(function(resp) {
            $scope.result = resp.data;
            $scope.isResult = true;
            $scope.isStart = false;
        })
        $scope.$broadcast('scroll.resize');
        $scope.scrollToMain();
    }

    $scope.showAnalyze = function() {
        $scope.curr = 0;
        $scope.isAnalyze = true;
        $scope.isResult = false;
        $scope.$broadcast('scroll.resize');
        $scope.scrollToMain();
    }

    $scope.viewResult = function() {
        $scope.isResult = true;
        $scope.isAnalyze = false;
        $scope.$broadcast('scroll.resize');
        $scope.scrollToMain();
    }

    $scope.scrollToMain = function() {
        $location.hash("container");
        $ionicScrollDelegate.anchorScroll(true);
    }

})
