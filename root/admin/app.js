var app = angular.module('StarterApp', ['ngMaterial']);

// directive for plus/trash icon
app.directive('xmdIcon', function() {
    return {
        template: '<md-icon md-font-icon="fa-{{icon}}" ng-click="handler()" class="fa" ng-style="{\'font-size\': size}"></md-icon>',
        scope: {
            icon: '@',
            handler: '&',
            size: '@'
        }
    };
});


app.run(function($http, $rootScope) {
    $http.get('/admin/api/videos').then(function(res) {
        $rootScope.siteList = res.data;
    });
});

app.controller('supportedSitesCtrl', function($scope, $mdDialog, $http) {

    $scope.openSiteForm = function(site) {
        $mdDialog.show({
            controller: 'siteFormCtrl',
            templateUrl: 'site-form.tmpl.html',
            locals: {
                site: site ? site : null
            }
        }).then(function(answer) {
            $scope.alert = 'You said the information was "' + answer + '".';
        }, function() {
            $scope.alert = 'You cancelled the dialog.';
        });
    };
});

app.controller('siteFormCtrl', function($scope, $mdDialog, site) {
    $scope.site = site ? site : {};
    $scope.mode = site ? 'edit' : 'create';
});

app.controller('pageConfigCtrl', function($timeout, $q, $scope, $mdDialog, $http) {

    $http.get('/admin/api/sites-list/india').then(function(resp) {
        $scope.siteGroups = resp.data;
    });

    var self = this;
    self.querySearch = querySearch;

    $scope.addSection = function() {
        $scope.siteGroups.push({});
    };

    $scope.confirmTrash = function(i) {
        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('操作确定')
            .content('你确定要删除该 Section 吗？')
            .ok('确定')
            .cancel('取消');
        $mdDialog.show(confirm).then(function() {
            var l = $scope.siteGroups;
            l.splice(l.indexOf(i), 1);
        });
    };

    function querySearch(query) {
        if (!query) return [];
        return $scope.siteList.filter(function(i) {
            return i.title.indexOf(query) > -1;
        });
    }
});

app.controller('ruleConfigCtrl', function($scope, $http, $mdDialog) {
    var raw;
    $http.get('/admin/api/rules').then(function(resp) {
        raw = resp.data;
        $scope.ruleList = resp.data;
    });

    $scope.addRule = function() {
        $scope.ruleList.unshift({});
    };

    $scope.delRule = function(i) {
        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('操作确定')
            .content('你确定要删除该 Section 吗？')
            .ok('确定')
            .cancel('取消');
        $mdDialog.show(confirm).then(function() {
            var l = $scope.ruleList;
            l.splice(l.indexOf(i), 1);
        });
    };

    $scope.checkDirty = function() {
        debugger;
    };

    $scope.saveRules = function() {
        $http.post('/admin/api/rules', {
            data: $scope.rules
        }).then(function() {
            // notity succ
        }, function() {
            // notity error
        });
    };
});