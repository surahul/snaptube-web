var seoModule = require('./seo');
var _ = require('lodash');

var assetmanager = require('assetmanager');
var assets = assetmanager.process({
    assets: require('../assets.json'),
    debug: (process.env.NODE_ENV !== 'production')
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
    }
}