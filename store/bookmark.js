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

    // 🔹 ADD BOOKMARK (Gunakan POST, bukan DELETE)
    async addBookmark({ commit, dispatch }, book) {
      try {
        if (!book || !book.id) {
          console.error("Error: Book data is missing or invalid", book);
          return;
        }

        const token = Cookies.get("jwt");
        await axios.post(
          `${baseURL}bookmarks`, // Gunakan POST untuk menambahkan
          { id_book: book.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log(`Added bookmark: ${book.id}`);
        
        // 🔥 Ambil ulang data dari API agar sinkron dengan database
        await dispatch("getBookmarks");

      } catch (error) {
        console.error("Error adding bookmark:", error.response ? error.response.data : error);
      }
    },

    // 🔹 REMOVE BOOKMARK (Gunakan DELETE, bukan POST)
    async removeBookmark({ commit, dispatch }, bookId) {
      console.log("Book ID:", bookId);
      try {
        if (!bookId) {
          console.error("Error: Book ID is missing or invalid", bookId);
          return;
        }
    
        const token = Cookies.get("jwt");
        await axios.delete(
          `${baseURL}bookmarks/${bookId}`, // Gunakan DELETE dan kirim ID di URL
          { headers: { Authorization: `Bearer ${token}` } }
        );
    
        console.log(`Removed bookmark: ${bookId}`);
    
        // 🔥 Ambil ulang data dari API agar sinkron dengan database
        await dispatch("getBookmarks");
    
      } catch (error) {
        console.error("Error removing bookmark:", error.response ? error.response.data : error);
      }
    },    
  },
};
