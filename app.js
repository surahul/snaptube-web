var _ = require('lodash');
var express = require('express');
var app = express();

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

/* async callback error handler */
var domainHandler = require('./helpers/domain-middleware');
app.use(domainHandler.Handler());

/* Simple Page with layout and support SPF */
var pageModule = require('./modules/pages');
pageModule.serve(['about', 'faq', 'contact', 'youtube-downloader-installation', 'privacy', 'terms'], app);
app.get('/howto', function(req, res) {
    res.redirect(301, '/youtube-downloader-installation');
});
app.get('/installation-guide', function(req, res) {
    res.redirect(301, '/youtube-downloader-installation');
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
    res.redirect(301, req.params[0]);
});
app.get('/', videoModule.index);
app.get('/top', videoModule.top);
app.get('/popular', videoModule.popular);
app.get('/list', videoModule.lists);

app.get('/list/id/:id', function(req, res) {
    res.redirect(301, '/list/' + req.params.id);
});
app.get('/list/:id', videoModule.list);

app.get('/category', videoModule.categories);

app.get('/category/:alias', videoModule.category);
app.get('/category/alias/:alias', function(req, res) {
    res.redirect(301, '/category/' + req.params.alias);
});

app.get('/downloading', videoModule.downloading);

app.get('/:action/vid/:vid', videoModule.detail);
app.get('/list/id/:lid/vid/:vid', videoModule.detail);
app.get('/category/alias/:alias/vid/:vid', videoModule.detail);
app.get('*', videoModule.detail);

/* empty handler? 404 it */
/* last rescure - log it */
app.use(function(err, req, res, next) {
    if (!_.isEmpty(err)) {
        logger.error({
            text: 'service 500',
            req: req,
            err: err
        });
    } else {
        logger.error({
            req: req,
            text: 'not found ' + req.getUrl()
        });
    }
    res.render('404.html');
});

/*process.on('uncaughtException', function(err) {
    console.log('uncaughtException caught the error');
});*/

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('snaptube web app listening at http://%s:%s', host, port);
});