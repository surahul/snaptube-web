APIPREFIX = '';

Vue.component('siteGroup', {
    template: $('#siteGroup').html(),
    replace: true,
    methods: {

    }
});

Vue.component('siteItem', {
    template: $('#siteItem').html(),
    replace: true,
    methods: {

    }
});

function startApp(apiData) {
    var chatApp = new Vue({
        el: 'body',
        data: {
            isShowLoading: false,
            isShowSettingSheet: false,
            loadingMsg: '加载中...',
            groupList: apiData
        },
        created: function() {},
        methods: function() {}
    });
}

(function() {
    FastClick.attach(document.body);

    startApp([{
        title: 'Short Video Sites',
        sites: [{
            title: 'Youtube',
            description: 'have fun with the largest world club etc',
            icon: 'http://ionicframework.com/img/docs/blue-album.jpg',
            url: 'http://localhost:3100/proxy?proxy=http://www.dailymotion.com'
        }, {
            title: 'Youtube',
            description: 'have fun with the largest world club etc',
            icon: 'http://ionicframework.com/img/docs/blue-album.jpg',
            url: 'http://youtube.com'
        }, {
            title: 'Youtube',
            description: 'have fun with the largest world club etc',
            icon: 'http://ionicframework.com/img/docs/blue-album.jpg',
            url: 'http://youtube.com'
        }]
    }, {
        title: 'Short Video Sites',
        sites: [{
            title: 'Youtube',
            description: 'have fun with the largest world club etc',
            icon: 'http://ionicframework.com/img/docs/blue-album.jpg',
            url: 'http://youtube.com'
        }, {
            title: 'Youtube',
            description: 'have fun with the largest world club etc',
            icon: 'http://ionicframework.com/img/docs/blue-album.jpg',
            url: 'http://youtube.com'
        }, {
            title: 'Youtube',
            description: 'have fun with the largest world club etc',
            icon: 'http://ionicframework.com/img/docs/blue-album.jpg',
            url: 'http://youtube.com'
        }]
    }, {
        title: 'Short Video Sites',
        sites: [{
            title: 'Youtube',
            description: 'have fun with the largest world club etc',
            icon: 'http://ionicframework.com/img/docs/blue-album.jpg',
            url: 'http://youtube.com'
        }, {
            title: 'Youtube',
            description: 'have fun with the largest world club etc',
            icon: 'http://ionicframework.com/img/docs/blue-album.jpg',
            url: 'http://youtube.com'
        }, {
            title: 'Youtube',
            description: 'have fun with the largest world club etc',
            icon: 'http://ionicframework.com/img/docs/blue-album.jpg',
            url: 'http://youtube.com'
        }]
    }]);

    $.ajax({
        type: 'GET',
        url: APIPREFIX + '/query',
        data: params,
        success: makeApp
    });
})();