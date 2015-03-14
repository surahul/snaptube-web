var request = require('request');
var async = require('async');

var API = 'http://api.snappea.com/v1/video/';

var categories;
request.get(API + 'categories?hl=id_GZ', function(error, response, body) {
    categories = JSON.parse(body);
});

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