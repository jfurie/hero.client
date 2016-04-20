import superagent from 'superagent';

export default function upload(client,auth,type,file, progressFn){
  return client.api.post('/resources/signUrl', {
    authToken: auth.authToken,
    data: {
      name: file.name,
      size: file.size,
      type: file.type,
    },
  }).then((signUrlData) => new Promise((resolve, reject) => {
    superagent.put(signUrlData.signed_request)
        .send(file)
        .on('progress', function(e) {
          if(progressFn){
            progressFn(e.percent);
          }
        })
        .end((err, {
          body,
        } = {}) => {
          if (err) {
            return reject(body || err);
          } else {
            return resolve(signUrlData.url);
          }
        });
  })).then((signUrlData) => {
    console.log(signUrlData);
    return client.api.post('/resources', {
      authToken: auth.authToken,
      data: {
        resourceType: type,
        item: signUrlData,
      },
    });
  });
}
