import config from 'config';
class _Config {

  constructor() {
    this.constants = config;
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
