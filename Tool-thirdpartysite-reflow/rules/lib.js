var styleManager = (function() {
    var rules = [];
    return {
        addRule: function(regexp, spec) {
            rules.push({
                regexp: regexp,
                spec: spec
            });
        },
        run: function() {
            var url = location.href,
                spec;
            rules.every(function(rule) {
                spec = rule.spec;
                // Todo: precompile regexp obj
                if (rule.regexp.test(url)) {
                    if (spec.css) {
                        require('./' + spec.css);
                    }
                    if (spec.domready) {
                        try {
                            Zepto(spec.domready);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    setTimeout(function() {
                        Android.injectDone();
                    }, 300);
                    return false;
                }
                return true;
            });
        }
    }
})();

if (!window.Android) {
    window.Android = {
        injectDone: function() {}
    };
}
if (!Android.downloadVideo) {
    Android.downloadVideo = function() {}
}

module.exports = exports = styleManager;