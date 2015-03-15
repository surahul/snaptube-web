var request = require('request');
var async = require('async');
var _ = require('lodash');
var swig = require('swig');

var API = 'http://api.snappea.com/v1/video/';

var categories;
request.get(API + 'categories?hl=id_GZ', function(error, response, body) {
    categories = JSON.parse(body);
});
var quickLinkTplFn = swig.compileFile('views/partials/quick-link.html');
var detailTplFn = swig.compileFile('views/partials/s-video-detail.html');

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
            topData.items.sort(function(b, a) {
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
                $special.items.sort(function(b, a) {
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
            $specialsArray.items.sort(function(b, a) {
                return a.latestEpisodeDate - b.latestEpisodeDate;
            });
            res.render('video/list', {
                currentPage: 'list',
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
            topData.items.sort(function(b, a) {
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
            res.render('video/popular', {
                currentPage: 'popular',
                $sitePath: [
                    ['Popular', '/popular']
                ],
                $popular: $popularArray
            });
        });
    },
    detail: function(req, res) {
        if (req.spf) {
            return exports.detailSPF(req, res);
        }

        function render() {
            $sitePath.push([$detailArray['title'], req.url]);
            res.render('video/detail.html', {
                currentPage: 'detail',
                title: $detailArray['title'],
                $sitePath: $sitePath,
                $data: $detailArray,
                $popular: $popularArray,
                categories: categories
            });
        }
        // top, popular|list, category
        var params = req.url.split('_').slice(1);
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
                        render();
                    });
                } else if (action == 'category') {
                    $sitePath.push([params[1], '/category/' + params[1]]);
                    render();
                } else {
                    render();
                }
            });
        }
    },
    detailSPF: function(req, res) {
        function render() {
            $sitePath.push([$detailArray['title'], req.url]);
            res.json({
                title: $detailArray['title'],
                body: {
                    'quick-link': quickLinkTplFn({
                        $sitePath: $sitePath
                    }),
                    'video-detail': detailTplFn({
                        $data: $detailArray
                    })
                }
            });
        }
        var params = req.url.split('_').slice(1);
        var action = params[0];
        var $sitePath = [
            [_.capitalize(action), '/' + action]
        ];
        var $videoId = params[2]; // /.*_(\d*)$/.exec(req.url)[1];
        if ($videoId) {
            async.map([
                API + $videoId,
            ], fetch, function(err, results) {
                $detailArray = JSON.parse(results[0]);
                if (action == 'list') {
                    fetch(API + 'special/detail?id=' + params[1] + '&region=IN&start=0&max=40', function(err, result) {
                        var $specialsArray = JSON.parse(result);
                        $sitePath.push([$specialsArray['special']['name'], '/list/' + $specialsArray['special']['id']]);
                        render();
                    });
                } else if (action == 'category') {
                    $sitePath.push([params[1], '/category/' + params[1]]);
                    render();
                } else {
                    render();
                }
            });
        }

    },
    downloading: function(req, res) {
        res.render('video/downloading', {
            currentPage: 'downloading',
            $sitePath: []
        });
    }
};