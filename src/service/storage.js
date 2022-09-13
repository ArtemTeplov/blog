class Storage {
    getFromStorage(item) {
      return localStorage.getItem(item);
    }
    setToStorage(key, item) {
      localStorage.setItem(key, item);
    }
  }
  const storage = new Storage();
  export default storage;