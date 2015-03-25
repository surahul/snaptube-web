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