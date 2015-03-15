var request = require('request');
var async = require('async');
var _ = require('lodash');

var API = 'http://api.snappea.com/v1/video/';

var categories;
request.get(API + 'categories?hl=id_GZ', function(error, response, body) {
    categories = JSON.parse(body);
});

var getKeyObj = function(key, val) {
    var tmp = {};
    tmp[key] = val;
    return tmp;
};

var fetch = function(file, cb) {
    request.get(file, function(err, response, body) {
        if (err) {
            cb(err);
        } else {
            cb(null, body); // First param indicates error, null=> no error
        }
    });
};

// Todo: wrap action handler with base handler support(like categories is current cotnroller available)
module.exports = exports = {
    index: function(req, res, next) {
        async.map([
            API + 'specials/rich?region=IN&start=0&max=5',
            API + 'toplist/topdownload?region=IN&start=0&max=10'
        ], fetch, function(err, results) {
            var topData = JSON.parse(results[1]);
            topData.items.sort(function(a, b) {
                return a.weeklyDownloadCount - b.weeklyDownloadCount;
            });
            res.render('video/index', {
                currentPage: 'index',
                categories: categories,
                $specials: JSON.parse(results[0]),
                $top: topData
            });
        });
    },
    categories: function(req, res) {
        var $videosArray = [];
        async.map(_.map(categories, function(cate) {
            return API + '?category=' + cate.alias + '&region=IN&start=0&max=5';
        }), fetch, function(error, results) {
            $videosArray = _.map(results, function(i, idx) {
                var tmp = JSON.parse(i);
                tmp.name = categories[idx].name;
                return tmp;
            });
            res.render('video/categories', {
                currentPage: 'categories',
                categories: categories,
                $sitePath: [
                    ['Categories', '/category']
                ],
                $categoryArray: $videosArray
            });
        });
    },
    category: function(req, res) {
        var $alias = req.params.alias;
        fetch(API + '?category=' + $alias + '&region=IN&start=0&max=40', function(err, result) {
            $list = JSON.parse(result);
            res.render('video/category', {
                currentPage: 'category',
                categories: categories,
                $alias: $alias,
                $list: $list,
                $sitePath: [
                    ['Categories', '/category'],
                    [$alias, '/' + $alias]
                ]
            });
        });
    },
    lists: function(req, res) {
        fetch(API + 'specials/rich?region=IN&videoCount=5&start=0&max=8', function(err, result) {
            var $specialsArray = JSON.parse(result);
            _.each($specialsArray, function($special, idx) {
                $special.items.sort(function(a, b) {
                    return a.latestEpisodeDate - b.latestEpisodeDate;
                });
            });
            res.render('video/lists', {
                currentPage: 'lists',
                categories: categories,
                $sitePath: [
                    ['List', '/list']
                ],
                $list: $specialsArray
            });
        });
    },
    list: function(req, res) {
        var id = req.params.id;
        fetch(API + 'special/detail?id=' + id + '&region=IN&start=0&max=40', function(err, result) {
            $specialsArray = JSON.parse(result);
            $specialsArray.items.sort(function(a, b) {
                return a.latestEpisodeDate - b.latestEpisodeDate;
            });
            res.render('video/list', {
                currentPage: 'lists',
                categories: categories,
                $sitePath: [
                    ['List', '/list'],
                    [$specialsArray.special.name, '/list/' + id]
                ],
                $list: $specialsArray
            });
        });
    },
    top: function(req, res) {
        async.map([
            API + 'toplist/topdownload?region=IN&start=0&max=101'
        ], fetch, function(err, results) {
            var topData = JSON.parse(results[0]);
            topData.items.sort(function(a, b) {
                return a.weeklyDownloadCount - b.weeklyDownloadCount;
            });
            res.render('video/top', {
                currentPage: 'top',
                categories: categories,
                $sitePath: [
                    ['Top', '/top']
                ],
                $top: topData
            });
            // check top/detail with sitePath
        });
    },
    popular: function(req, res) {
        async.map([
            API + 'starter?region=IN&start=0&max=40'
        ], fetch, function(err, results) {
            var $popularArray = JSON.parse(results[0]);
            res.render('video/index', {
                currentPage: '',
                $sitePath: [
                    ['Popular', '/popular']
                ],
                popular: $popularArray
            });
        });
    },
    detail: function(req, res) {
        // top, popular|list, category
        var params = req.url.split('_').slice(1);
        var tmp = {};
        var action = params[0];
        var $sitePath = [
            [_.capitalize(action), '/' + action]
        ];
        var $videoId = params[2]; // /.*_(\d*)$/.exec(req.url)[1];
        if ($videoId) {
            async.map([
                API + $videoId,
                API + 'starter?region=IN&start=0&max=10'
            ], fetch, function(err, results) {
                $detailArray = JSON.parse(results[0]);
                $popularArray = JSON.parse(results[1]);
                if (action == 'list') {
                    fetch(API + 'special/detail?id=' + params[1] + '&region=IN&start=0&max=40', function(err, result) {
                        var $specialsArray = JSON.parse(result);
                        $sitePath.push([$specialsArray['special']['name'], '/list/' + $specialsArray['special']['id']]);
                    });
                    $template = 'listdetail';
                }
                $sitePath.push([$detailArray['title'], '.']);
                res.render('video/detail.html', {
                    pageTitle: $detailArray['title'],
                    $sitePath: $sitePath,
                    $data: $detailArray,
                    $popular: $popularArray,
                    categories: categories
                });
            });
        }
    }
};
