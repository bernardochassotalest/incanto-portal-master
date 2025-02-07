#!/bin/sh
cd /opt/repositories/incanto
git reset --hard
git checkout master
git pull origin master

cd server
pm2 stop pm2.config.js
yarn && yarn build
NODE_ENV=production yarn sequelize db:migrate
pm2 start pm2.config.js
cd ..

cd jobs
pm2 stop pm2.config.js
yarn && yarn build
pm2 start pm2.config.js
cd ..

cd etl
pm2 stop pm2.config.js
yarn && yarn build
pm2 start pm2.config.js
cd ..

cd web
yarn && yarn build
cp -r build/* /usr/share/nginx/html

cd