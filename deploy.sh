export NODE_ENV=production
cd ~/projects/snaptube-web
git pull
grunt
pm2 reload app.js