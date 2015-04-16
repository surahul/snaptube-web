var express = require('express');

var domain = require('domain');

var request = require('request');
var assert = require('assert');

/* Constant Variables */
var port = 9000;
var url = 'http://localhost:' + port;

describe('snaptube.in testing', function() {
    var server;

    before(function(done) {
        var app = new express();

        app.get('/', function(req, res, next) {
            res.end('works');
        });

        server = app.listen(port, done);
    });

    after(function() {
        server.close();
    });

    it('should receive response from app', function(done) {
        request.get(url, function(err, resp, body) {
            assert.equal(resp.statusCode, 200);
            assert.equal(data, 'works');
            done();
        });
    });
});