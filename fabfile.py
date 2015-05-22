from fabric.api import hosts, run, task, execute, runs_once
import json

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

@hosts(web_servers)
def fetch_feedback():
    out = run('cd ~/projects/snaptube-web && cat webapp.log |grep "user feedback"')
    for line in out.split('\n'):
        feed = json.loads(line)
        print '[SITE]' + feed['text'].split('feedback:')[1] +'\t'+ feed['req']['headers']['x-real-ip']

