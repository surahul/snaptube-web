var seoModule = require('./seo');
var _ = require('lodash');
var bodyParser = require('body-parser');

/* assetmanager used in template */
var assetmanager = require('assetmanager');
var assets = assetmanager.process({
    assets: require('../assets.json'),
    debug: (process.env.NODE_ENV !== 'production')
});

/* logger config */
var bunyan = require('bunyan');
var EmailStream = require('bunyan-emailstream').EmailStream;
var emailStream = new EmailStream({
    from: 'robot@snaptube.in',
    to: 'gaohailang@wandoujia.com',
    subject: '[DEBUG] - Error for snaptube.in website'
}, {
    type: 'direct'
});
var logStreams = [{
    level: 'info',
    stream: process.stdout
}, {
    type: 'rotating-file',
    path: 'webapp.log',
    period: '1w',
    count: 4
}];

if (process.env.NODE_ENV == 'production') {
    logStreams.push({
        type: 'raw',
        stream: emailStream
    });
}

var logger = bunyan.createLogger({
    name: 'snaptube.in',
    serializers: {
        req: bunyan.stdSerializers.req
    },
    streams: logStreams
});

module.exports = exports = {
    bootstrap: function(app) {
        // parse application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({
            extended: false
        }));
        // parse application/json
        app.use(bodyParser.json());

        app.use(function(req, res, next) {
            if (req.url.indexOf('spf=navigate') > -1) {
                req.spf = true;
            }

            req.getUrl = function() {
                return req.protocol + "://" + req.get('host') + req.originalUrl;
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