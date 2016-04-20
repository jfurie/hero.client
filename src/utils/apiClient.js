import {normalize } from 'normalizr';
import superagent from 'superagent';
const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(baseUrl, path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;

  // Prepend `/api` to relative URL, to proxy to API server.
  return baseUrl + '/api' + adjustedPath;
}

class _ApiClient {

  constructor(options) {

    this.baseUrl = '';

    if (options.baseUrl) {
      this.baseUrl = options.baseUrl;
    }

    let self = this;

    methods.forEach((method) =>
      this[method] = (path, {
        params, data, authToken,
      } = {}, schema) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(self.baseUrl, path));
        request.set('Accept', 'application/json');
        if (params) {
          request.query(params);
        }

        if (authToken) {
          request.set('Authorization',authToken.id);
        }

        if (data) {
          request.send(data);
        }

        request.end((err, {
          body,
        } = {}) => {
          if (err) {
            return reject(body || err);
          } else {
            if(schema){
              body = normalize(body,schema);
            }
            return resolve(body);
          }
        });
      }));
  }

  getBaseUrl() {
    return this.baseUrl;
  }
}

const ApiClient = _ApiClient;

export default ApiClient;
