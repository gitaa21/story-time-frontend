import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = 'http://127.0.0.1:8000/api/';

export default {
  namespaced: true,
  state: () => ({
    token: Cookies.get('jwt') || null,
    tokenExpirationDate: Cookies.get('tokenExpirationDate') || null,
    userLogin: {},
    isLogin: false,
    showPopup: false,
    popupMessage: '',
  }),
  mutations: {
    setToken(state, { idToken, expiresIn }) {
      state.token = idToken;
      state.tokenExpirationDate = expiresIn;
      Cookies.set("tokenExpirationDate", expiresIn);
      Cookies.set("jwt", idToken);
    },

    setUserLogin(state, { userData, loginStatus }) {
      state.userLogin = userData || {}; 
      state.isLogin = loginStatus || false; 
    },

    setUserAvatar(state, avatarUrl) {
      state.userLogin.avatar_image = avatarUrl;
    },    

    setUserLogout(state) {
      state.token = null;
      state.userLogin = {};
      state.isLogin = false;
      state.tokenExpirationDate = null;
      Cookies.remove('jwt');
      Cookies.remove('tokenExpirationDate');
    },

    setShowPopup(state, { show, message }) {
      state.showPopup = show;
      state.popupMessage = message;
    },

  },


  actions: {
    async getRegisterData({ commit }, { name, username, email, password, confirm_password }) {
      try {
        const { data } = await axios.post(baseURL + 'register', {
          name,
          username,
          email,
          password,
          confirm_password
        });

        console.log('Registration Response:', data);
        
        Cookies.set('jwt', data.data.token);
        Cookies.set('tokenExpirationDate', new Date().getTime() + (data.data.expiresIn || 3600) * 1000);

        commit('setToken', {
          idToken: data.data.token,
          expiresIn: new Date().getTime() + (data.data.expiresIn || 3600) * 1000,
        }); 
        commit('setUserLogin', { userData: data.data.user, loginStatus: true });
      } catch (err) {
        console.error('Registration Error:', err);
        throw err;
      }
    },

    async getLoginData({ commit }, payload) {
      try {
        const { data } = await axios.post(baseURL + 'login', payload);

        console.log('Login Response:', data);

        Cookies.set('jwt', data.data.token);
        Cookies.set('tokenExpirationDate', new Date().getTime() + (data.data.expiresIn || 3600) * 1000);

        commit('setToken', {
          idToken: data.data.token,
          expiresIn: new Date().getTime() + (data.data.expiresIn || 3600) * 1000,
        });

        commit('setUserLogin', { userData: data.data, loginStatus: true });

        return data;
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Terjadi kesalahan saat login.';
        console.error('Login Error:', errorMessage);
        throw new Error(errorMessage);
      }
    },

    async getUser({ commit }) {
      try {
        const token = Cookies.get('jwt');
        const tokenExpirationDate = parseInt(Cookies.get('tokenExpirationDate'), 10);

        console.log('Token:', token); 
        console.log('Token Expiration Date:', tokenExpirationDate);

        if (!token || !tokenExpirationDate || tokenExpirationDate <= new Date().getTime()) {
          commit('setUserLogout');
          return;
        }

        const { data } = await axios.get(baseURL + 'user', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log('Respons dari Backend:', data);

        commit('setUserLogin', { userData: data.data, loginStatus: true });
      } catch (err) {
        commit('setUserLogout');
        console.error('Error fetching user data:', err.response?.data?.message || err.message);
        throw err;
      }
    },

    async updateUser({ commit }, payload) {
      try {
        const token = Cookies.get('jwt');
        const response = await axios.put(baseURL + 'edit-profile', payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        commit('setUserLogin', { userData: response.data.user, loginStatus: true });
        return response.data;
      } catch (err) {
        console.error('Error updating user:', err);
      }
    },

    async uploadAvatar({ commit }, file) {
      try {
        const token = Cookies.get('jwt');
        
        // Pastikan file ada
        if (!file) {
          throw new Error('No file selected');
        }
    
        const formData = new FormData();
        formData.append('avatar_image', file);
    
        const response = await axios.post(baseURL + 'upload-image', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
    
        if (!response.data || !response.data.avatar_image) {
          throw new Error('Invalid response from server');
        }
    
        const avatarUrl = baseURL.replace('/api/', '') + response.data.avatar_image;
        
        commit('setUserAvatar', avatarUrl);
    
        return response.data;  
      } catch (err) {
        console.error('Error uploading avatar:', err);
        throw new Error(err.response?.data?.message || 'Failed to upload avatar');
      }
    },    
        
    async logout({ commit }) {
      try {
        const response = await axios.post(baseURL + 'logout', null, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('jwt')}`
          }
        });

        console.log('Logout API Response:', response.data);

        Cookies.remove('jwt');
        Cookies.remove('tokenExpirationDate');

        commit('setUserLogout');

        this.$router.push('/login');  

      } catch (err) {
        console.error('Logout API Error:', err);
      }
    },

    triggerPopup({ commit }, message) {
      commit('setShowPopup', { show: true, message });
    }
  },
};
