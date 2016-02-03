let alternativeLocal = {};

class _LocalStorageClient {

  constructor() {
  }

  isLocalStorageSupported() {
    var testKey = 'test';
    try {
      localStorage.setItem(testKey, '1');
      let value = localStorage.getItem(testKey);

      return value == '1';
    } catch (error) {
      return false;
    }
  }
  get(key) {
    let  o = null;
    if(this.isLocalStorageSupported()){
      o = localStorage.getItem(key);

    } else {
      o = alternativeLocal[key];
    }
    if (o) {
      return JSON.parse(o);
    }

    return null;
  }

  set(key, object) {
    if(this.isLocalStorageSupported()){
      localStorage.setItem(key, JSON.stringify(object));
    } else {
      alternativeLocal[key] = JSON.stringify(object);
    }
  }

  remove(key) {
    if(this.isLocalStorageSupported()){
      localStorage.removeItem(key);
    } else {
      delete alternativeLocal[key];
    }
  }
}

const LocalStorage = _LocalStorageClient;

export default LocalStorage;
