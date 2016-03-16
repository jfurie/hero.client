import express from 'express';
import swig from 'swig';
import config from './config/config';
import compression from 'compression';
let app = null;

process.on('uncaughtException', function (err) {
  console.error('Uncaught Exception');
  console.error(err.stack);
  process.exit(1);
});

function startApp() {
  console.log('Starting Server');
  var app = express();
  app.use(compression());
  app.engine('html', swig.renderFile);
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'html');
  app.set('view cache', false);
  swig.setDefaults({
    cache: false
  });
  app.use(express.static(config.root + '/public'));
  app.get('*', function(req, res) {
    res.render('main', {});
  });
  app.listen(config.port, function() {
    console.log('Browse your REST API at %s', config.port);
  });
}

app = startApp();
export default app;
