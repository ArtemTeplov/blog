class APIservise {
    _apiBase = 'https://blog.kata.academy/api/';

    async getArticles(page) {
        const offset = page === 1 ? 0 : page * 5;
        const res = await fetch(`${this._apiBase}articles?limit=5&offset=${offset}`);
        const result = await res.json();
        return result;
      }
    
      async getArticle(slug) {
        const res = await fetch(`${this._apiBase}articles/${slug}`);
        const result = await res.json();
        return result;
      }
}

const API = new APIservise();
export default API;