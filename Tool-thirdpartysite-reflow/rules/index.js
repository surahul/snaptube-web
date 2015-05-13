
var styleManager = require('./lib.js');

function linkify(url) {
    var parser = document.createElement('a');
    parser.href = url;
    return parser;
}

function removeIf($dom) {
    if ($dom.length) {
        $dom.remove();
    }
}

require("./base.css");
// clean body inline script tag(admaster etc)

styleManager.addRule(/mrpopat/, {
    css: 'mrpopat.css',
    domready: function() {
        // show player, detail, comments etc
        $('.middle-main-div .player_title').show().next().show().next().show();
    }
});

/* Todo */
styleManager.addRule(/metacafe/, {
    // css: 'metacafe.css',
    domready: function() {
        console.log('metacafe');
    }
});

styleManager.addRule(/dailytube/, {
    css: 'dailytube.css',
    domready: function() {
        console.log('dailytube');
    }
});

styleManager.addRule(/pagalworld/, {
    domready: function() {
        // removeIf($('div center'));
        $('.bgmenu').prev().hide();
        removeIf($('body>center'));
        // clean non-div elements for .menu/.bgmenu
        removeIf($('.menu, .bgmenu').find('script, noscript, br'));
        $('.menu .menu_row').each(function(idx, i) {
            var $i = $(i);
            var $a = $i.find('a');
            if (!$i.find('b, center').length) {
                $i.remove();
            }
            if ($a.length && ($a.find('b').text().trim() == '[ Click Here ]')) {
                $i.wrap('<a>').parent().attr('href', $a.attr('href'));
                $a.remove();
            }
        });
    }
});

styleManager.addRule(/freshmaza/, {
    css: 'freshmaza.css',
    domready: function() {
        removeIf($('.content').next().find('div').not('.update, .update1')); // ads after categories
        $('.content').find('.update, .update1').each(function(idx, i) {
            var $item = $(i);
            var $a = $item.find('a');
            if ($a.text() == '[Click Here]') {
                $item.wrap('<a>').parent().attr('href', $a.attr('href'));
                $a.remove();
            }
        });
    }
});

styleManager.addRule(/yumvideo/, {
    domready: function() {
        $('.content *').slice(1, $('.content h2').first().index()).remove();
    }
});

styleManager.addRule(/movievilla/, {
    css: 'movievilla.css',
    domready: function() {
        try {
            $('body').children('div').not('[align="center"]').each(function(idx, i) {
                var $i = $(i);
                var $a = $i.find('a');
                if ($a.length && $a.text().trim() === '[HERE]') {
                    $i.find('b').eq(0).wrap('<a>').parent().attr('href', $a.attr('href'));
                    $a.remove();
                }

                if ($i.find('[align="center"]').length) {
                    $i.find('[align="center"]').show();
                }

                if ($i.find('.top').length) {
                    $i.hide();
                }
            });
        } catch (e) {
            console.log(e);
        }
        // item clickable all
        // item header
        $('body p').remove();
    }
});

styleManager.addRule(/songsgig/, {
    domready: function() {
        removeIf($('.sb')); // top ads
        removeIf($('.box>a'));
        removeIf($('body>center'));
        removeIf($('.box').has('.ql'));
        // $('.box .il').has('a>img').remove();

        $('.il.el a').each(function(idx, i) {
            var $a = $(i);
            if (linkify($a.attr('href')).hostname != 'songsgig.in') {
                $a.remove();
            }
            $a.find('font').each(function(idxx, ii) {
                var $ii = $(ii);
                if ($ii.text().trim() == '[Click here]') {
                    $ii.remove();
                }
            });
        });
    }
});


/* Tood: */
styleManager.addRule(/skymovies/, {
    domready: function() {

    }
});

styleManager.addRule(/o2cinemas/, {
    domready: function() {

    }
});

styleManager.addRule(/pinguda/, {
    domready: function() {

    }
});


/* Tood */
styleManager.addRule(/whatsappdaily/, {
    domready: function() {
        $('#mainDiv').children().each(function(idx, i) {
            console.log(i.className);
            if (!i.className) {
                $(i).remove();
            }
            if (location.href.indexOf('download')) {
                if (i.className == 'fl') {
                    $(i).remove();
                }
            } else {
                if ('search, devider, featured, catRow, ad1'.indexOf(i.className) == -1) {
                    if (i.id === 'category') return;
                    console.log(i);
                    $(i).remove();
                }
            }
        });
    }
});

styleManager.addRule(/vimeo/, {
    css: 'vimeo.css',
    domready: function() {
        if (location.pathname === '/') {
            $ = Zepto;
            var $clips = $('.clip_feed'),
                clipId;
            // Todo: throttle it
            $clips.on('touchstart', 'li .snaptube-download-btn', function(item) {
                clipId = $(this).parents('.player').data('clip-id');
                console.log('downloading ' + clipId);
                Android.downloadVideo('https://vimeo.com/' + clipId);
            });

            function addBtn(x) {
                var $x = $(x),
                    $controls;
                setTimeout(function() {
                    $controls = $x.find('.controls');
                    if ($controls.length) {
                        if ($controls.find('.snaptube-download-btn').length) return;
                        $controls.find('button.play').after($('<button class="snaptube-download-btn rounded-box"></button>'));
                    } else {
                        addBtn(x);
                    }
                }, 1000);
            }

            $clips.find('li').each(function(idx, i) {
                addBtn(i);
            });
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    for (var i = 0; i < mutation.addedNodes.length; i++) {
                        var x = mutation.addedNodes[i];
                        if (x.tagName.toUpperCase() === 'LI' && x.id.indexOf('clip_item') > -1) {
                            addBtn(x);
                        }
                    }
                });
            });
            observer.observe($clips[0], {
                childList: true
            });
        }
    }
});


styleManager.run();