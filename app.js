var express = require('express');
var _ = require('lodash');
var swig = require('swig');
var app = express();

var timeAgo = require('./helpers/timeAgo');

var videoModule = require('./modules/video');

// app.set('view engine', 'jade');
// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

swig.setFilter('lessThen', function(str, len, sub) {
    if (str.length > len) {
        return str.slice(0, len) + sub;
    }
    return str;
});

swig.setFilter('timeAgo', function(ts) {
    console.log(ts);
    try {
        return timeAgo.timeAgo(ts);
    } catch (e) {
        console.log(e);
        return 'now'
    }
});
swig.setFilter('number', function(n) {
    function reverse(s) {
        return s.split('').reverse().join('');
    }
    return reverse('' + n).match(/.{1,3}/g).reverse().join(',');
});

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({
    cache: false
});
// NOTE: You should always cache templates in a production environment.
// Don't leave both of these to `false` in production!

app.use(function(req, res, next) {
    // Todo: switch by url
    _.extend(res.locals, {
        _req: req,
        $title: 'Siva',
        $keywords: 'keyword sss',
        $description: req.url,
        checkMobile: function(req) {
            if (!req.header) return false;
            var ua = req.header('user-agent');
            return /mobile/i.test(ua);
        },
        formatUrl: function(str) {
            return str.replace('"', '')
                .replace('?', '')
                .replace(' ', '-')
                .replace('#', '-')
                .replace('_', '-');
        }
    });
    next();
});

app.get('/', videoModule.index);
/*app.get('/', function(req, res) {
    res.render('index', {

    });
});*/

app.get('/jade', function(req, res) {
    res.render('index', {
        title: 'Heyx',
        message: 'Hello there!',
        pets: ['cat', 'dog']
    });
});

// serve pages view
_.each(['about', 'contact', 'installationguide', 'privacy', 'terms'], function(page) {
    app.get('/' + page, function(req, res) {
        res.render('pages/' + page);
    });
});

var options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function(res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
};

app.use('/static', express.static('static', options));

app.listen(3000);