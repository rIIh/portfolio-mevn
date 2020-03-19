import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import Axios from "axios";
Axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  // Do something with response error
  return Promise.resolve(error.response);
});

const C = require("./api/consts");

export default new Vuex.Store({
  state: {
    user: {
      status: "",
      token: localStorage.getItem("user-token") || ""
    },
    app: {
      adminMode: localStorage.getItem("admin-mode") === "true" ? true : false,
      theme: "theme--light",
      dev: process.env.NODE_ENV === 'development',
      window: {
        screen: {}
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.user.token,
    isDev: state => !!state.app.dev,
    isSuper: (state, getters) => state.app.adminMode && getters.isAuthenticated,
    theme: state => state.app.theme,
    authStatus: state => state.user.status,
    window: state => state.app.window
  },
  mutations: {
    [C.AUTH_REQUEST]: state => {
      state.user.status = "loading";
    },
    [C.AUTH_SUCCESS]: (state, token) => {
      state.user.status = "success";
      state.user.token = token;
    },
    [C.AUTH_ERROR]: (state, value) => {
      state.user.status = value;
    },
    [C.AUTH_LOGOUT]: state => {
      state.user.token = "";
    },
    [C.ADMIN_MODE_CHANGE]: (state, value) => {
      state.app.adminMode = value;
    },
    [C.ADMIN_MODE_SWAP]: state => {
      state.app.adminMode = !state.app.adminMode;
    },
    [C.THEME_CHANGE]: (state, value) => {
      state.app.theme = "theme--" + (value < 50 ? "dark" : "light");
    },
    [C.RESIZE]: (state, value) => (state.app.window.screen = value)
  },
  actions: {
    [C.ADMIN_MODE_CHANGE]: ({ commit }, value) => {
      localStorage.setItem("admin-mode", value);
      commit(C.ADMIN_MODE_CHANGE, value);
    },
    [C.ADMIN_MODE_SWAP]: ({ commit, state }) => {
      commit(C.ADMIN_MODE_SWAP);
      localStorage.setItem("admin-mode", state.app.adminMode);
    },
    [C.AUTH_CHECK]: ({ dispatch }) => {
      return new Promise((resolve, reject) => {
        Axios.get(C.AUTH_CHECK)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            if (err.status === 401) dispatch(C.AUTH_LOGOUT);
            reject(err);
          });
      });
    },
    [C.AUTH_REQUEST]: ({ commit }, user) => {
      return new Promise((resolve, reject) => {
        // The Promise used for router redirect in login
        commit(C.AUTH_REQUEST);
        Axios.post(C.AUTH_URL, user)
          .then(resp => {
            const token = resp.data.data.token;
            localStorage.setItem("user-token", token); // store the token in localstorage
            Axios.defaults.headers.common["x-access-token"] = token;
            commit(C.AUTH_SUCCESS, token);
            // you have your token, now log in your user :)
            resolve(resp);
          })
          .catch(err => {
            commit(C.AUTH_ERROR, err);
            localStorage.removeItem("user-token"); // if the request fails, remove any possible user token if possible
            delete Axios.defaults.headers.common["x-access-token"];
            reject(err);
          });
      });
    },
    [C.AUTH_LOGOUT]: ({ commit }) => {
      return new Promise(resolve => {
        commit(C.AUTH_LOGOUT);
        localStorage.removeItem("user-token"); // clear your user's token from localstorage
        delete Axios.defaults.headers.common["x-access-token"];
        resolve();
      });
    },
    [C.THEME_CHANGE]: ({ commit }, value) => {
      commit(C.THEME_CHANGE, value);
    },
    [C.RESIZE]: ({ commit }, value) => {
      commit(C.RESIZE, JSON.parse(JSON.stringify(value)));
    }
  }
});
