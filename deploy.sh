export NODE_ENV=production
cd ~/projects/snaptube-web
git pull origin master
npm install
grunt
pm2 reload app.js