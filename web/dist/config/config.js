'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var rootPath = _path2['default'].normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';
var workers = process.env.WEB_CONCURRENCY || 1;
var config = {
  all: {
    env: env,
    root: rootPath,
    numberOfWorkers: workers,
    port: process.env.PORT || 3050
  },
  development: {
    db: 'mongodb://localhost:27017'
  }
};

exports['default'] = _lodash2['default'].extend(config.all, config[env] || {});
module.exports = exports['default'];
//# sourceMappingURL=config.js.map
