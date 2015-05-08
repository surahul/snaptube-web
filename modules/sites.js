// used for android snaptube video sites page
var request = require('request');
var cache = require('memory-cache');
var _ = require('lodash');

var nodemailer = require('nodemailer');

var sendMail = (function() {
    var transporter = nodemailer.createTransport();
    var baseMailObj = {
        from: 'robot@snaptube.in',
        to: 'gaohailang@wandoujia.com, liujiao@wandoujia.com, wanzheng@wandoujia.com, xiebingying@wandoujia.com, hello@snaptube.in',
        subject: '[Daily] - video site submit'
    };

    var sender;
    if (process.env.NODE_ENV == 'production') {
        sender = function(msg) {
            baseMailObj.text = msg;
            transporter.sendMail(baseMailObj);
        }
    } else {
        sender = function() {}
    }

    return sender;
})();

var CACHEKEY = 'androidSitesList';

var isShowIcons = true;

var baseModule = require('./base');
var logger = baseModule.getLogger();

module.exports = exports = {
    list: function(req, res) {

        function render(list) {
            var data = _.cloneDeep(list);
            var pn = req.query.pn || '';
            /*if (pn && isGPApk(pn)) {
                isShowIcons = false;
            } else {
                isShowIcons = true;
            }*/
            if (pn === 'com.snaptube.premium') {
                isShowIcons = true;
            } else {
                data = filterYoutube(data);
                isShowIcons = false;
            }
            res.render('android/sites', {
                $data: data,
                isShowIcons: isShowIcons
            });
        }

        function filterYoutube(list) {
            _.each(list, function(g) {
                _.any(g.sites, function(i, idx) {
                    if (i.title.toLowerCase() == 'youtube.com') {
                        g.sites.splice(idx, 1);
                        return true;
                    }
                });
            });
            return list;
        }

        function isGPApk(pn) {
            // GP包名:
            var pns = 'com.astube.first, com.snaptubelite.two，com.snaptube.lite.cone';
            return pns.indexOf(pn) > -1;
        }

        function buildIntentUri(url) {
            var parts = url.split('://'),
                scheme, hostpath;
            hostpath = parts.pop();
            scheme = parts[0] ? parts[0] : 'http';
            // intent://pagalworld.com#Intent;scheme=http;action=android.intent.action.VIEW;package=_package.local;end
            return 'intent://' + hostpath + '#Intent;scheme=' + scheme + ';action=android.intent.action.VIEW;package=_package.local;end';
        }

        if (cache.get(CACHEKEY) && !req.query.debug) {
            render(cache.get(CACHEKEY));
        } else {
            request.get('http://www.wandoujia.com/needle/source/getJSON/59', function(err, resp, body) {
                var data = JSON.parse(body);
                // check retina media
                _.each(data, function(i) {
                    _.each(i.sites, function(ii) {
                        ii.icon = ii.icon.split('.png')[0] + '@2x.png';
                        ii.icon = ii.icon.replace('images', 'image');
                        if(!req.query.debug) {
                            ii.url = buildIntentUri(ii.url);
                        }
                    });
                });

                cache.put(CACHEKEY, data, 1000 * 60 * 60);
                render(data);
            });
        }
    },
    toggleIcon: function(req, res) {
        isShowIcons = !isShowIcons;
        return res.end('Done, isShowIcons: ' + isShowIcons);
    },
    delCache: function(req, res) {
        cache.del(CACHEKEY);
        return res.end('delete ' + CACHEKEY + ' done!');
    },
    create: function(req, res) {
        try {
            var url = req.body.url;
            sendMail(url);
            logger.info({
                req: req,
                text: '[Sites Module] create new site from user feedback: ' + url
            });
        } catch (e) {
            logger.debug({
                req: req,
                err: e
            });
        }
        return res.redirect('/_sites-page/add-success.html');
    }
};