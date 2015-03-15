var express = require('express');
var _ = require('lodash');
var swig = require('swig');
var app = express();

_.capitalize = function(str) {
    return str[0].toUpperCase() + str.slice(1);
};
require('./helpers/swig-extend.js');
var videoModule = require('./modules/video');

// app.set('view engine', 'jade');
// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

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
    console.log(req.url);
    if (req.url.indexOf('spf=navigate') > -1) {
        req.spf = true;
    }
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
        }
    });
    next();
});

// serve pages view
_.each(['about', 'faq', 'contact', 'installation-guide', 'privacy', 'terms'], function(page) {
    app.get('/' + page, function(req, res) {
        res.locals.currentPage = page;
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

app.get('/', videoModule.index);
app.get('/top', videoModule.top);
app.get('/popular', videoModule.popular);
app.get('/list', videoModule.lists);
app.get('/list/:id', videoModule.list);
app.get('/category', videoModule.categories);
app.get('/category/:alias', videoModule.category);
app.get('/downloading', videoModule.downloading);
app.get('*', videoModule.detail); // use RegExp
app.use(function(err, req, res, next) {
    res.render('404.html');
});

app.listen(3000);