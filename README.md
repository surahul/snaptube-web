
## snaptube.in 官网代码
官网从外包的 php 版移入，用 express 作为 应用Web 框架为基础开发
包括了一些静态页（faq, help, about 等页）还有动态页（video module 下的使用 api.snappea.com 的数据），分别有两个布局文件： views/layouts

## 客户端网页重排代码
[README.md](./Tool-thirdpartysite-reflow/readme.md)


## snaptube 客户端网站列表首页 和 站点反馈
Node 代码在 modules/sites.js 中
静态页面代码在 root/_sites-page 中（包括站点添加，instagram 向导页等）
列表首页的动态模板页面在 views/android/sites.html 中

如何添加新的网站：
通过 http://www.wandoujia.com/needle/ 编辑配置 snaptube-videos-india 这个资源 json。icon 图片可以通过改 Repo host 也可以通过其他 cdn host

数据查看：
因为页面 host 在 snaptube.in/_sites-page/index.html 中，所以相关数据通过 GA 查看，如首页页面的点击情况（参加 Events - Android - sites ）

PS:
代码是从其之前的独立 Repo 中移入，build 工具为 codekit 客户端
所以 CSS 通过 less 编译后产生，同时 CSS 代码也需要入库！



## Tip

```
forever -w --watchDirectory . app.js
export NODE_ENV=production
```

```
git hook to triggr ?!

fabfile:
export NODE_ENV=production
git pull
grunt
pm2 reload app.js
```


```python
from fabric.api import hosts, run

web_servers = ('em-web0', 'em-web0')

@hosts(web_servers)
def deploy_web():
    run('bash ~/projects/snaptube-web/deploy.sh')
```