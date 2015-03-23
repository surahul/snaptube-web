var swig = require('swig');
var timeAgo = require('./timeAgo');

swig.setFilter('lessThan', function(str, len, sub) {
    if (str.length > len) {
        return str.slice(0, len) + sub;
    }
    return str;
});

swig.setFilter('timeAgo', function(ts) {
    if (ts) {
        try {
            return timeAgo.timeAgo(ts);
        } catch (e) {
            return 'now';
        }
    } else {
        return '';
    }
});
swig.setFilter('number', function(n) {
    function reverse(s) {
        return s.split('').reverse().join('');
    }
    if (n > 999) {
        return reverse('' + n).match(/.{1,3}/g).reverse().join(',');
    } else {
        return n;
    }
});
swig.setFilter('formatUrl', function(str) {
    return str.replace(/"/g, '')
        .replace(/\?/g, '')
        .replace(/\s/g, '-')
        .replace(/#/g, '-')
        .replace(/_/g, '-');
});
swig.setFilter('safeVar', function(obj, keystr) {
    try {
        var ret = eval(keystr);
        if (ret == 'undefined') return '';
        if (ret.indexOf('[object Object]') > -1) return '';
        return ret;
    } catch (e) {
        return '';
    }
});