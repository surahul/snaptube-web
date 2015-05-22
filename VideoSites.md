## Intro


## Snaptube 客户端网站列表

- Node 代码在 modules/sites.js 中
- 静态页面代码在 root/_sites-page 中（包括站点添加，instagram 向导页等）
- 列表首页的动态模板页面在 views/android/sites.html 中

添加新的网站：
通过 http://www.wandoujia.com/needle/ 编辑配置 snaptube-videos-india 这个资源 json. icon 图片可以通过改 Repo host 也可以通过其他 cdn host

数据查看：
因为页面在 snaptube.in/_sites-page/index.html 中，所以相关数据通过 GA(权限请找相关老师) 查看，如首页页面的点击情况（参加 Events - Android - sites ）

## Deploy
代码是从其之前的独立 Repo 中移入，build 工具为 codekit 客户端, 所以 CSS 通过 less 编译后产生，同时 CSS 代码也需要入库！
发布流程参考 `Snatpube.in` 的 [发布](./README.md#Deploy)

## 用户反馈导出
`python export-sites.py 2>&1 | tee export-sites.log`

```python
#!/usr/bin/env python
# -*- coding:utf-8 -*-

import gmail

g = gmail.login('gaohailang@wandoujia.com', <app-pwd>)

emails = g.inbox().mail(sender="robot@snaptube.in")
with open('sites-submit-from-email.txt', 'w') as f:
    for email in emails:
        email.fetch()
        site = u''+email.body
        print email.body
        f.write(site)
```