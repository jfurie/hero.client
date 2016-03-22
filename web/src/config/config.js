import path from 'path';
import _ from 'lodash';
let rootPath = path.normalize(__dirname + '/..');
let env = process.env.NODE_ENV || 'development';
let workers = process.env.WEB_CONCURRENCY || 1;
let config = {
  all: {
    env,
    root: rootPath,
    numberOfWorkers: workers,
    port: process.env.PORT || 3050,
  },
  development: {
    db: 'mongodb://localhost:27017',
    apiBaseUrl: 'https://core-api-loopback-dev.herokuapp.com',
    webBaseUrl: 'https://hero-client-dev.herokuapp.com',
  },
  production: {
    apiBaseUrl: 'https://core-api-loopback.herokuapp.com',
    webBaseUrl: 'https://hero-client.herokuapp.com',
  },
  local: {
    apiBaseUrl: 'http://localhost:3003',
    webBaseUrl: 'http://localhost:5455',
  },
};

export default _.extend(
  config.all,
  config[env] || {}
);
