var DIR = __dirname + '/../views/pages/';

var _ = require('lodash');
var fs = require('fs');
var pageWrapTpl = fs.readFileSync(DIR + '_wrap.html', 'utf8');
var swig = require('swig');

module.exports = exports = {
    serve: function(pageList, app) {
        _.each(pageList, function(page) {
            var tpl = fs.readFileSync(DIR + page + '.html', 'utf8');
            app.get('/' + page, function(req, res) {
                res.locals.currentPage = page;
                var titleMap = {
                    'about': 'Best Youtube Downloader for Android',
                    'faq': 'High Resolution Mobile Videos Download',
                    'contact': 'SnapTube Contact Us',
                    'youtube-downloader-installation': 'Youtube Downloader for Android : Step By Step',
                    'privacy': 'SnapTube Privacy',
                    'terms': 'SnapTube Terms'
                };
                if (req.spf) {
                    return res.json({
                        title: titleMap[page] || '',
                        body: {
                            'page-terms': tpl
                        }
                    });
                } else {
                    res.send(swig.render(pageWrapTpl.replace('###PLACEHOLDER###', tpl), {
                        locals: {
                            $title: titleMap[page] || ''
                        },
                        filename: DIR + page + '.html' // MAKE include/extend/import work
                    }));
                }
            });
        });
    }
};