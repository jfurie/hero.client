'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _swig = require('swig');

var _swig2 = _interopRequireDefault(_swig);

var _configConfig = require('./config/config');

var _configConfig2 = _interopRequireDefault(_configConfig);

var app = null;

function startApp() {
  var app = (0, _express2['default'])();
  app.engine('html', _swig2['default'].renderFile);
  app.set('views', _configConfig2['default'].root + '/app/views');
  app.set('view engine', 'html');
  app.set('view cache', false);
  _swig2['default'].setDefaults({
    cache: false
  });
  app.use(_express2['default']['static'](_configConfig2['default'].root + '/public'));
  app.get('*', function (req, res) {
    res.render('main', {});
  });
  app.listen(_configConfig2['default'].port, function () {});
}

app = startApp();
exports['default'] = app;
module.exports = exports['default'];
//# sourceMappingURL=server.js.map
