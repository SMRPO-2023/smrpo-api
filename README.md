Backend built on Nest framework for project.

## Installation

```bash
$ npm i
```

## Running the app

```bash
# development
$ npm run start
$ npm run start:dev
$ npm run start:debug

# production mode
$ npm run build
$ npm run start:prod
```

## Use PM2 to run at startup
```bash
# Have pm2 install ie npm install -g pm2

pm2 start dist/main.js --name=api

pm2 startup systemd

pm2 save
```