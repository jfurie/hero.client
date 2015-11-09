import express from 'express';
import swig from 'swig';
import config from './config/config';
let app = null;

function startApp() {
  var app = express();
  app.engine('html', swig.renderFile);
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'html');
  app.set('view cache', false);
  swig.setDefaults({
    cache: false
  });
  app.use(express.static(config.root + '/public'));
  app.get('/', function(req, res) {
    res.render('main', {});
  });
  app.listen(config.port, function() {});
}

app = startApp();
export default app;
