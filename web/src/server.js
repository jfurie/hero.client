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
  app.get('/j/:shortId/:title', function(req, res) {
    let request = require('request');

    request(`${config.apiBaseUrl}/api/jobs/meta?shortId=${req.params.shortId}`, function (error, response, body) {
      let meta = {};

      if (!error && response.statusCode == 200) {
        let data = JSON.parse(body);
        meta.title = data.title;
        meta.description = data.description.replace('### Job Description ', '').substring(0, 170);
        meta.url = `http://www.hero.jobs${req.url}`;
        meta.type = 'jobie_hero_jobs:jobie';

        if (data.location) {
          meta.location = data.location;
        }

        if (data.image) {
          meta.image = data.image;
        }
      }

      res.render('main', {meta});
    });
  });
  app.get('*', function(req, res) {
    let meta = {};

    meta.title = 'Hero.jobs';
    meta.url = 'http://www.hero.jobs';
    meta.image = 'http://www.hero.jobs/img/hero_logo.png';
    meta.type = 'website';

    res.render('main', {meta});
  });
  app.listen(config.port, function() {
    console.log('Browse your REST API at %s', config.port);
  });
}

app = startApp();
export default app;
