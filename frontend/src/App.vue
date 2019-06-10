<template lang="pug">
  v-app#app
    v-dialog(v-model="post" lazy max-width="450px")
      album(@uploaded="post = !post; showMessage()") Upload new album
    v-snackbar(color="primary" v-model="success") Album successully uploaded
      v-btn(dark flat @click.native="success = false") Close

    v-container(style="max-width: 100%")
      v-layout(column fill-height style="min-height: 100%")
        v-flex(shrink)
          v-layout(justify-space-between row align-content-center)
            v-flex(shrink align-self-center)
              router-link.pr-3(:to="link()" class="main link" v-tooltip="'Этих надписей и подсказок в финале не будет'")
                h1 Yura Taralov
              template(v-if="isAuth")
                v-btn.px-3(round small @click="adminChange" :depressed="adminMode" :color="adminMode ? 'blue' : ''" :dark="adminMode") admin mode
                v-btn.px-3(round small @click="post = !post") post album
                v-btn(round small @click="logout") log out
            v-flex(shrink align-self-center)
              router-link(to="/about") Contacts
        v-flex()
          router-view.view
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import Album from "@/components/Album.vue";
import Axios from "axios";
const C = require("./api/consts");

export default {
  data() {
    return {
      post: false,
      success: false
    };
  },
  computed: {
    adminMode() {
      return this.$store.getters.isSuper;
    },
    isAuth() {
      return this.$store.getters.isAuthenticated;
    }
  },
  methods: {
    link() {
      let target = this.$router.currentRoute.name === "home" ? "/gallery" : "/";
      return target;
    },
    showMessage() {
      this.success = true;
      setTimeout(() => (this.success = false), 2000);
    },
    adminChange() {
      this.$store.dispatch(C.ADMIN_MODE_SWAP);
    },
    logout() {
      this.$store.dispatch(C.AUTH_LOGOUT);
    }
  },
  created: function() {
    Axios.interceptors.response.use(undefined, function(err) {
      return new Promise(function(resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          // if you ever get an unauthorized, logout the user
          this.$store.dispatch(AUTH_LOGOUT);
          // you can also redirect to /login if needed !
        }
      });
    });
  },
  components: {
    Navigation,
    Album
  }
};
</script>


<style lang="scss">
$firstbreak: 1024px;
$footerHeight: 125px;

.tooltip {
  background-color: lightgoldenrodyellow;
  border-radius: 10px;
  z-index: 10000000;
  .tooltip-inner {
    padding: 10px;
    max-width: 300px;
  }
}

.v-btn {
  vertical-align: super !important;
}

a.main {
  text-decoration: none;
  h1 {
    color: black;
    display: inline;
    text-align: center;
  }
}

a {
  font-weight: bold;
  color: black;
  transition: 0.3s;

  &:hover {
    color: lightgray;
    transition: 0.3s;
  }

  &.router-link-exact-active {
    color: white;
  }
}

.force-overflow {
  min-height: 450px;
}

.view {
  padding-top: 32px;
  width: 100%;
}

body,
html,
#app {
  min-width: 100%;
  width: 100%;
  min-height: 100%;
  height: 100%;
}

#app {
  display: flex;
  flex-grow: 1;
  flex-flow: column;
  font-family: "Space Mono", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
}
</style>
