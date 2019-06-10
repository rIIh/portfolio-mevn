import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css'

import EvaIcons from 'vue-eva-icons'
import VTooltip from 'v-tooltip'

Vue.use(EvaIcons)
Vue.use(Vuetify);
Vue.use(VTooltip);
Vue.use(require('vue-moment'));

Vue.prototype.$axios = require('axios').create();
Vue.config.productionTip = false;

import Axios from 'axios'

const token = localStorage.getItem('user-token')
if (token) {
  Axios.defaults.headers.common['x-access-token'] = token
}

export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");