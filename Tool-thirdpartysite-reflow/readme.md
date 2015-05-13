## Intro
build third-party-reflow.js which served at /static/js/third-party-reflow.js used to clean up/adjust video sites at native client

### 开发环境部署
bundle.js 通过 webpack 打包 css/js 层（具体参见 entry.js）

开发的时候，通过 tampermonkey chrome 插件注入到第三方网站，通过 devtools 联调开发调整。
PS:（通过 static . 来启动 web servrer host 脚本）
Todo: 代码库中是有 build generate 出来的的 third-party-reflow.js 这一点不好，待改造，整合入外部的 build 流程

### 具体代码
```
webpack --progress --colors --watch -p entry.js bundle.js
cp bundle.js ../static/js/third-party-reflow.js # (然后再提交代码)

when debug, using tampermonkey
(function() {
    var s = document.createElement('script');
    var h = document.getElementsByTagName('head')[0];
    s.src = 'http://localhost:8080/bundle.js';
    s.async = 1;
    h.parentNode.insertBefore(s, h);
})();
```
