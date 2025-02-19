import axios from "axios";
import Cookies from "js-cookie";

const baseURL = "http://127.0.0.1:8000/api/";

export default {
  namespaced: true,
  state: () => ({
    bookmarks: [],
  }),

  mutations: {
    SET_BOOKMARKS(state, bookmarks) {
      state.bookmarks = bookmarks;
    },
    ADD_BOOKMARK(state, book) {
      state.bookmarks.push(book);
    },
    REMOVE_BOOKMARK(state, bookId) {
      state.bookmarks = state.bookmarks.filter(bookmark => bookmark.id !== bookId);
    },
  },

  actions: {
    async getBookmarks({ commit }) {
      try {
        const token = Cookies.get("jwt");
        const { data } = await axios.get(`${baseURL}bookmarks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        commit("SET_BOOKMARKS", data.data);
        console.log("Fetched bookmarks:", data.data);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    },

    async addBookmark({ commit, dispatch }, book) {
      try {
        if (!book || !book.id) {
          console.error("Error: Book data is missing or invalid", book);
          return;
        }

        const token = Cookies.get("jwt");
        await axios.post(
          `${baseURL}bookmarks`, 
          { id_book: book.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log(`Added bookmark: ${book.id}`);
        
        await dispatch("getBookmarks");

      } catch (error) {
        console.error("Error adding bookmark:", error.response ? error.response.data : error);
      }
    },

    async removeBookmark({ commit, dispatch }, bookId) {
      console.log("Book ID:", bookId);
      
      try {
          if (!bookId) {
              console.error("Error: Book ID is missing or invalid", bookId);
              return;
          }
  
          const token = Cookies.get("jwt");
  
          await axios.delete(`${baseURL}bookmarks-delete`, {
              headers: { Authorization: `Bearer ${token}` },
              data: { id_book: bookId } 
          });
  
          console.log(`Removed bookmark: ${bookId}`);
  
          commit("bookmark/REMOVE_BOOKMARK", bookId);
  
          await dispatch("getBookmarks");
  
      } catch (error) {
          console.error("Error removing bookmark:", error.response ? error.response.data : error);
      }
  }
  
}
};
