var express = require('express');
var app = express();

var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json
app.use(bodyParser.json());

var swig = require('swig');
require('./helpers/swig-extend.js');
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

if (process.env.NODE_ENV == 'production') {
    require('newrelic');
} else {
    app.set('view cache', false);
    swig.setDefaults({
        cache: false
    });
}

/* Baic Prepare: inject locals, assetmanager etc */
var baseModule = require('./modules/base');
baseModule.bootstrap(app);
var logger = baseModule.getLogger();

/* Static and root file serves */
var StaticOptions = {
    dotfiles: 'ignore',
    etag: true,
    index: false
};
app.use('/static', express.static('static', StaticOptions));
app.use(express.static('root', StaticOptions)); // such as robots.txt, sitemap.xml

/* Simple Page with layout and support SPF */
var pageModule = require('./modules/pages');
pageModule.serve(['about', 'faq', 'contact', 'youtube-downloader-installation', 'privacy', 'terms'], app);
app.get('/howto', function(req, res) {
    res.redirect('/youtube-downloader-installation');
});
app.get('/installation-guide', function(req, res) {
    res.redirect('/youtube-downloader-installation');
});

/* Temp used by android client */
var sitesModule = require('./modules/sites');
app.get('/_sites-page/index.html', sitesModule.list);
app.get('/_sites-page/toggle-icon', sitesModule.toggleIcon);
app.post('/_sites-page/new', sitesModule.create);
app.get('/_sites-page/_delcache', sitesModule.delCache);

/* Video Module - Core functionality */
var videoModule = require('./modules/video');
app.get(/\/video(.*)/, function(req, res) {
    res.redirect(req.params[0]);
});

app.get('/', videoModule.index);
app.get('/top', videoModule.top);
app.get('/popular', videoModule.popular);
app.get('/list', videoModule.lists);

app.get('/list/id/:id', function(req, res) {
    res.redirect('/list/' + req.params.id);
});
app.get('/list/:id', videoModule.list);

app.get('/category', videoModule.categories);

app.get('/category/:alias', videoModule.category);
app.get('/category/alias/:alias', function(req, res) {
    res.redirect('/category/' + req.params.alias);
});

app.get('/downloading', videoModule.downloading);

app.get('/:action/vid/:vid', videoModule.detail);
app.get('/list/id/:lid/vid/:vid', videoModule.detail);
app.get('/category/alias/:alias/vid/:vid', videoModule.detail);
app.get('*', videoModule.detail);

app.use(function(err, req, res, next) {
    logger.debug({
        req: req,
        err: err
    });
    res.render('404.html');
});

app.listen(3000);
