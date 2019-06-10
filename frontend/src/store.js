import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import Axios from 'axios'

const C = require('./api/consts')

export default new Vuex.Store({
  state: {
    user: {
      token: localStorage.getItem('user-token') || ''
    },
    app: {
      adminMode: localStorage.getItem('admin-mode') === 'true' ? true : false
    }
  },
  mutations: {
    [C.AUTH_REQUEST]: (state) => {
      state.user.status = 'loading'
    },
    [C.AUTH_SUCCESS]: (state, token) => {
      state.user.status = 'success'
      state.user.token = token
    },
    [C.AUTH_ERROR]: (state) => {
      state.user.status = 'error'
    },
    [C.AUTH_LOGOUT]: (state) => {
      state.user.token = ""
    },
    [C.ADMIN_MODE_CHANGE]: (state, value) => {
      state.app.adminMode = value;
    },
    [C.ADMIN_MODE_SWAP]: (state) => {
      state.app.adminMode = !state.app.adminMode;
    }
  },
  getters: {
    isAuthenticated: state => !!state.user.token,
    isSuper: (state, getters) => state.app.adminMode && getters.isAuthenticated,
    authStatus: state => state.user.status,
  },
  actions: {
    [C.ADMIN_MODE_CHANGE]: ({
      commit
    }, value) => {
      localStorage.setItem('admin-mode', value)
      commit(C.ADMIN_MODE_CHANGE, value);
    },
    [C.ADMIN_MODE_SWAP]: ({
      commit,
      state
    }) => {
      commit(C.ADMIN_MODE_SWAP);
      localStorage.setItem('admin-mode', state.app.adminMode)
    },
    [C.AUTH_CHECK]: ({
      dispatch
    }) => {
      return new Promise((resolve, reject) => {
        Axios.get(C.AUTH_CHECK).then(res => {
          resolve(res);
        }).catch(err => {
          if (err.status === 401)
            dispatch(C.AUTH_LOGOUT);
          console.log(err)
          resolve(err)
        });
      })
    },
    [C.AUTH_REQUEST]: ({
      commit,
      dispatch
    }, user) => {
      return new Promise((resolve, reject) => { // The Promise used for router redirect in login
        commit(C.AUTH_REQUEST)
        Axios.post(
            C.AUTH_URL,
            user,
          )
          .then(resp => {
            const token = resp.data.data.token
            localStorage.setItem('user-token', token) // store the token in localstorage
            Axios.defaults.headers.common['x-access-token'] = token
            commit(C.AUTH_SUCCESS, token)
            // you have your token, now log in your user :)
            resolve(resp)
          })
          .catch(err => {
            commit(C.AUTH_ERROR, err)
            localStorage.removeItem('user-token') // if the request fails, remove any possible user token if possible
            reject(err)
          })
      })
    },
    [C.AUTH_LOGOUT]: ({
      commit,
      dispatch
    }) => {
      return new Promise((resolve, reject) => {
        commit(C.AUTH_LOGOUT)
        localStorage.removeItem('user-token') // clear your user's token from localstorage
        delete Axios.defaults.headers.common['x-access-token']
        resolve()
      })
    }
  }
});