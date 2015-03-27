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

    $.ajax({
        type: 'GET',
        url: APIPREFIX + '/_data/sites.json',
        success: startApp
    });
})();