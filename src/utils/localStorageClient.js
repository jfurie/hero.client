class _LocalStorageClient {

  constructor() {
  }

  get(key) {
    var o = localStorage.getItem(key);
    if (o) {
      return JSON.parse(o);
    }

    return null;
  }

  set(key, object) {
    localStorage.setItem(key, JSON.stringify(object));
  }

  remove(key) {
    localStorage.removeItem(key);
  }
}

const LocalStorage = _LocalStorageClient;

export default LocalStorage;
