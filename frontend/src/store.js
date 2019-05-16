import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      loggedin: false
    }
  },
  mutations: {
    setStatus(state, val) {
      state.user.loggedin = val;
    }
  },
  actions: {
    async init({ commit }) {
      var axios = require('axios')
      var status = await axios.default.get('/api/status');
      commit('setStatus', status.data);
    }
  }
});
