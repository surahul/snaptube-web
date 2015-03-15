var swig = require('swig');
var timeAgo = require('./timeAgo');

swig.setFilter('lessThan', function(str, len, sub) {
    if (str.length > len) {
        return str.slice(0, len) + sub;
    }
    return str;
});

swig.setFilter('timeAgo', function(ts) {
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
swig.setFilter('formatUrl', function(str) {
    return str.replace(/"/g, '')
        .replace(/\?/g, '')
        .replace(/\s/g, '-')
        .replace(/#/g, '-')
        .replace(/_/g, '-');
});