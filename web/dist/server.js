'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _swig = require('swig');

var _swig2 = _interopRequireDefault(_swig);

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = null;

function startApp() {
  var app = (0, _express2.default)();
  app.engine('html', _swig2.default.renderFile);
  app.set('views', _config2.default.root + '/app/views');
  app.set('view engine', 'html');
  app.set('view cache', false);
  _swig2.default.setDefaults({
    cache: false
  });
  app.use(_express2.default.static(_config2.default.root + '/public'));
  app.get('*', function (req, res) {
    res.render('main', {});
  });
  app.listen(_config2.default.port, function () {});
}

app = startApp();
exports.default = app;
//# sourceMappingURL=server.js.map
