class _Config {

  constructor() {
    this.constants = {};
    this.constants['apiBaseUrl'] = 'http://localhost:3003';
    //this.constants['apiBaseUrl'] = 'https://core-api-loopback.herokuapp.com';
  }

  get(key) {
    if (this.constants[key]) {
      return this.constants[key];
    }

    return null;
  }
}

const Config = new _Config();
export default Config;
