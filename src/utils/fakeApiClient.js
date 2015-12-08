const methods = ['get', 'post', 'put', 'patch', 'del'];

class _FakeApiClient {

  constructor() {

    methods.forEach((method) =>
      this[method] = (path, {
        data,
      } = {}) => new Promise((resolve) => {
        if (data) {
          return resolve(data);
        }
        return resolve();
      }));
  }
}

const FakeApiClient = _FakeApiClient;

export default FakeApiClient;
