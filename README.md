## snaptube.in 官网代码
官网从外包的 php 版移入，用 express 作为 应用Web 框架为基础开发
包括了一些静态页（faq, help, about 等页）还有动态页（video module 下的使用 api.snappea.com 的数据），分别有两个布局文件： views/layouts

## 客户端网页重排代码
[README.md](./Tool-thirdpartysite-reflow/readme.md)

## 客户端网页列表
[VideoSites.md](./VideoSites.md)

## 相关脚本与命令

开发时候，自动重启应用服务器

```shell
forever -w --watchDirectory . app.js
export NODE_ENV=production
```

## Deploy

- `ssh work@aws-ap-relay.wandoujia.com` # 先请相关老师添加 AWS relay 机器的权限
- `cd gaohailang`
- `fab deploy_web`

deploy.sh

```shell
export NODE_ENV=production
cd ~/projects/snaptube-web
git pull origin master
npm install
grunt
pm2 reload app.js
```

fabfile.py

```python
from fabric.api import hosts, run

web_servers = ('em-web0', 'em-web0')

@hosts(web_servers)
def deploy_web():
    run('bash ~/projects/snaptube-web/deploy.sh')

@hosts(web_servers)
def toggle_icon():
    run('curl http://localhost:3000/_sites-page/toggle-icon')

@hosts(web_servers)
def del_cache():
    run('curl http://localhost:3000/_sites-page/_delcache')

@hosts(web_servers)
def fetch_feedback():
    out = run('cd ~/projects/snaptube-web && cat webapp.log |grep "user feedback"')
    for line in out.split('\n'):
        feed = json.loads(line)
        print '[SITE]' + feed['text'].split('feedback:')[1] +'\t'+ feed['req']['headers']['x-real-ip']
```