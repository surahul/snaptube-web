var seoModule = require('./seo');
var _ = require('lodash');

var assetmanager = require('assetmanager');
var assets = assetmanager.process({
    assets: require('../assets.json'),
    debug: (process.env.NODE_ENV !== 'production')
});

var bunyan = require('bunyan');
var EmailStream = require('bunyan-emailstream').EmailStream;
var emailStream = new EmailStream({
    from: 'robot@snaptube.in',
    to: 'gaohailang@wandoujia.com',
    subject: '[DEBUG] - Error for snaptube.in website'
}, {
    type: 'direct'
});
var logger = bunyan.createLogger({
    name: 'snaptube.in',
    serializers: {
        req: bunyan.stdSerializers.req
    },
    streams: [{
        level: 'info',
        stream: process.stdout
    }, {
        type: 'rotating-file',
        path: 'webapp.log',
        period: '1w',
        count: 4
    }, {
        type: 'raw',
        stream: emailStream
    }]
});

module.exports = exports = {
    bootstrap: function(app) {
        app.use(function(req, res, next) {
            if (req.url.indexOf('spf=navigate') > -1) {
                req.spf = true;
            }

            // Todo: switch by url
            _.extend(res.locals, {
                assets: assets,
                _req: req,
                _locals: req.locals,
                $keywords: '',
                $description: '',
                checkMobile: function(req) {
                    if (!req.header) return false;
                    var ua = req.header('user-agent');
                    return /mobile/i.test(ua);
                },
                getMeta: function(page, alias) {
                    return seoModule.getMeta(page, alias);
                }
            });
            next();
        });
    },
    getLogger: function() {
        return logger;
    }
}
