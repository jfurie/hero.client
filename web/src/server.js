import express from 'express';
import swig from 'swig';
import config from './config/config';
import compression from 'compression';
import removeMd  from 'remove-markdown';
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
  app.get('*',function(req,res,next){
    if(req.headers['x-forwarded-proto']!='https')
      res.redirect('https://'+req.get('host') + req.originalUrl);
    else
      next(); /* Continue to other routes if we're not redirecting */
  });
  app.use(express.static(config.root + '/public'));

  app.get('/j/:shortId/:title', function(req, res) {
    let request = require('request');
    console.log('shortId started');
    request(`${config.apiBaseUrl}/api/jobs/meta?shortId=${req.params.shortId}`, function (error, response, body) {
      let meta = {};
      console.log('error:',error,'\n body: ',body);
      if (!error && response.statusCode == 200) {
        let data = JSON.parse(body);
        console.log(data);
        meta.title = data.title;
        if(data.public && data.company){
          meta.title = meta.title +  ' at ' + data.company.name;
        }
        if(data.city && data.state){
          meta.title = meta.title +  ' in ' + data.city +', ' + data.state;
        }
        if(data.description){
          meta.description = removeMd(data.description.replace('### Job Description ', '')).substring(0, 170);
        }
        if(!meta.description || meta.description == ''){
          meta.description = 'The next 5 minutes could change everything. Discover the top tech companies hiring near you.';
        }
        meta.url = req.protocol + '://' + req.get('host') + req.originalUrl;
        meta.type = 'hero_jobs:jobie';

        if (data.location) {
          meta.location = data.location;
        }

        if (data.image) {
          meta.image = data.image;
        }
        console.log(meta);
      }

      res.render('main', {meta});
    });
  });
  app.get('*', function(req, res) {
    let meta = {};

    meta.title = 'Hero.jobs';
    meta.url = req.protocol + '://' + req.get('host');
    meta.image = `${meta.url}/img/hero_logo.png`;
    meta.type = 'website';

    res.render('main', {meta});
  });
  app.listen(config.port, function() {
    console.log('Browse your REST API at %s', config.port);
  });
}

app = startApp();
export default app;
