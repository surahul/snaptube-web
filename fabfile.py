from fabric.api import hosts, run

web_servers = ('em-web0', 'em-web1')

@hosts(web_servers)
def deploy_web():
    run('bash ~/projects/snaptube-web/deploy.sh')

@hosts(web_servers)
def toggle_icon():
    run('curl http://localhost:3000/_sites-page/toggle-icon')

@hosts(web_servers)
def del_cache():
    run('curl http://localhost:3000/_sites-page/_delcache')