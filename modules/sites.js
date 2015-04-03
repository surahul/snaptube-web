// used for android snaptube video sites page
var request = require('request');
var cache = require('memory-cache');
var _ = require('lodash');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();
var baseMailObj = {
    from: 'robot@snaptube.in',
    to: 'gaohailang@wandoujia.com, liujiao@wandoujia.com',
    subject: '[Daily] - video site submit'
};

var CACHEKEY = 'androidSitesList';

module.exports = exports = {
    list: function(req, res) {
        function render(data) {
            res.render('android/sites', {
                $data: data
            });
        }

        if (cache.get(CACHEKEY)) {
            render(cache.get(CACHEKEY));
        } else {
            request.get('http://www.wandoujia.com/needle/source/getJSON/59', function(err, resp, body) {
                var data = JSON.parse(body);
                // check retina media
                _.each(data, function(i) {
                    _.each(i.sites, function(ii) {
                        ii.icon = ii.icon.split('.png')[0] + '@2x.png';
                        ii.icon = ii.icon.replace('images', 'image');
                    });
                });
                cache.put(CACHEKEY, data, 1000 * 60 * 60);
                render(data);
            });
        }
    },
    delCache: function(req, res) {
        cache.del(CACHEKEY);
        return res.end('delete ' + CACHEKEY + ' done!');
    },
    create: function(req, res) {
        var url = req.body.url;
        baseMailObj.text = url;
        try {
            // transporter.sendMail(baseMailObj);
        } catch (e) {

        }
        return res.redirect('/_sites-page/add-success.html');
    }
};