import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = 'http://127.0.0.1:8000/api/';


export default {
  namespaced: true,
  state: () => ({
  }),
  mutations: {
  },
  actions: {
    async getBookData() {
      const token = Cookies.get('jwt');
      try {
        const { data } = await axios.get(baseURL + 'books', {
          headers: {
            Authorization: `Bearer ${token}`
          }});
        console.log("dataaaaaaaaaaaaaaaaaa", data.data)

        return data.data;

      } catch (error) {
        console.error('Get Book Error:', error);
      }
    },

    async getBookDetail(_, bookId) {
      const token = Cookies.get('jwt');
      try {
        const { data } = await axios.get(baseURL + `books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }});
        console.log("Book Detail Data IDD Lagi:", bookId);
        console.log("Book Detail Data:", data);
        return data;
      } catch (error) {
        console.error('Get Book Detail Error:', error);
      }
    },

    async getBookBySort(_, { sortOption, category, keyword, page }) {
      const token = Cookies.get('jwt');
      try {
        const params = {
          page: page || 1, 
          sort: sortOption ? sortOption.toLowerCase() : 'newest', 
        };
    
        if (category) params.id_category = category.toLowerCase();
        if (keyword) params.keyword = keyword.toLowerCase();
    
        const { data } = await axios.get(baseURL + 'books', {
          params,
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
    
        console.log("Data fetched:", data.data);
        return data;
      } catch (error) {
        console.error('Get Book Error:', error);
      }
    },
  
    async getCategoryData() {
      try {
        const { data } = await axios.get(baseURL + 'categories')
        console.log("categoryyyyyyyyyyy", data.data)

        return data.data;
      } catch (error) {
        console.error('Get Category Error:', error);
      }
    },

    async getBookByUser(_, { userId, page }) {
      const token = Cookies.get('jwt');
      try {
        const params = {
          page: page || 1, // Default page ke 1 jika tidak diberikan
        };
    
        const { data } = await axios.get(`${baseURL}books-users`, {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        console.log("Data fetched (User Books):", data.data);
        return data;
      } catch (error) {
        console.error('Get Book By User Error:', error);
      }
    },
    
    async getBookByBookMark(_, { page }) {
      const token = Cookies.get('jwt');
      try {
        const params = {
          page: page || 1, 
        };
    
        const { data } = await axios.get(`${baseURL}bookmarks`, {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        console.log("Data fetched (Bookmarks):", data.data);
        return data;
      } catch (error) {
        console.error('Get Book By Bookmark Error:', error);
      }
    },
    

    async getBookByCategory() {
      const token = Cookies.get('jwt');
      try {
        const { data } = await axios.get(baseURL + `books-category`, {
          headers: {
            Authorization: `Bearer ${token}`
          }});

        console.log("Book Category Data:", data.data);
        return data.data;
      } catch (error) {
        console.error('Get Book Category Error:', error);
      }
    },

    async addNewBook(_, payload) {
      try {
        const token = Cookies.get('jwt');

        const { data } = await axios.post(baseURL + 'books', payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
        console.log("Book Data:", data.data);
        return data;
      } catch (error) {
        console.error('Add Book Error:', error);
      }
    },

    async editBook(_, { id, payload }) {
      try {
        const token = Cookies.get('jwt');

        const { data } = await axios.post(baseURL + `books/${id}`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });

        console.log("Book Data:", data);
        return data.data;
      } catch (error) {
        console.error('Edit Book Error:', error);
      }
    },

    async destroyBook(_, id) {
      try {
        const token = Cookies.get('jwt');

        const { data } = await axios.delete(baseURL + `books/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log("Book Data:", data);
        return data.data;
      } catch (error) {
        console.error('Edit Book Error:', error);
      }
    }
  }
};
