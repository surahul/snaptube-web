## Intro
it builds third-party-reflow.js which served at /static/js/third-party-reflow.js used to clean up/adjust video sites at android app

### 开发环境
bundle.js 通过 `webpack` 打包 css/js 层（具体参见 entry.js）

开发的时候，通过 tampermonkey chrome 插件注入到第三方网站，通过 devtools 联调开发调整。

PS:（通过 `static .` 来启动 web servrer host 脚本）

Todo: 代码库中是有 build generate 出来的的 third-party-reflow.js 这一点不好，待改造，整合入外部的 build 流程

### Deploy
`webpack --progress --colors --watch -p entry.js bundle.js`

`cp bundle.js ../static/js/third-party-reflow.js` # (然后再提交代码)
接下来参考 `Snatpube.in` 的 [发布](../README.md#Deploy)

### 重排规则
addRule(siteRegExp, opt{css, domready} )

- siteRegExp 是具体规则匹配站点路径的正则表达式
- opt 中包括了需要注入的 css 规则（通过路径指明）和一些在 domready 事件后要执行的清理逻辑和自定义规则

```js
styleManager.addRule(/dailytube/, {
    css: 'dailytube.css',
    domready: function() {
        console.log('dailytube');
    }
});
```

### 相关脚本命令
```
webpack --progress --colors --watch -p entry.js bundle.js
cp bundle.js ../static/js/third-party-reflow.js # (然后再提交代码)

# when debug, using tampermonkey
(function() {
    var s = document.createElement('script');
    var h = document.getElementsByTagName('head')[0];
    s.src = 'http://localhost:8080/bundle.js';
    s.async = 1;
    h.parentNode.insertBefore(s, h);
})();
```

### Android 示例
[webviewInjection.java](./webviewInjection.java)

```js
// 需要屏蔽的广告 SDK 域名
["admaster.union.ucweb.com",
"serve.vdopia.com",
"cdn.vdopia.com",
"sdk.adspruce.com",
"cdn.admoda.com",
"my.mobfox.com",
"ads.adiquity.com",
"show.ketads.com",
"ad.atdmt.com"]
```