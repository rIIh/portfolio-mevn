<template lang="pug">
  v-app#app()
    .dev-box(v-if="environment === 'development'")
      p.unselectable DEV
    transition()
      img.background(:src="assetsPath + background.path" alt="")
    v-navigation-drawer(absolute v-model="tools" v-if="breakpoint.smAndDown && isAuth")
      v-list
        v-list-tile(@click="adminChange")
          v-list-tile-action
            v-checkbox(v-model="adminMode" readonly)
          v-list-tile-content 
            v-list-tile-title admin mode
        v-list-tile(@click="openEditor(); tools = false")
          v-list-tile-action
            v-icon.material-icons-outlined attachment
          v-list-tile-content 
            v-list-tile-title post album
        v-list-tile(@click="openPageEditor(); tools = false")
          v-list-tile-action
            v-icon.material-icons-outlined color_lens
          v-list-tile-content 
            v-list-tile-title theme
        v-list-tile(@click="logout")
          v-list-tile-action
            v-icon.material-icons-outlined exit_to_app
          v-list-tile-content 
            v-list-tile-title log out

    theme.fill-height(:view-id="$route.name")
      .layout.column.fill-height
        .flex.shrink
          v-layout(justify-space-between align-baseline shrink style="padding: 24px; padding-bottom: 0")
            v-flex(shrink)
              v-icon.unselectable.pr-3(@click.stop="tools = !tools" v-if="breakpoint.smAndDown && isAuth") menu
              router-link(:to="link()" class="main link")
                h1.brand.unselectable(:class="$store.getters.theme" :style="breakpoint.smAndDown ? 'font-size: 24px' : ''") Melv Space
              template(v-if="isAuth && breakpoint.mdAndUp")
                span.no-wrap.px-3
                  r-btn.px-3(:pressed="adminMode" @click="adminChange") admin mode
                  r-btn.px-3(@click="openEditor") post album
                  r-btn.px-3(@click="logout") log out
                  r-btn.pa-0(@click="openPageEditor")
                    v-icon.material-icons-outlined(small @click="") color_lens
            v-flex(shrink)
              router-link.link.about.unselectable(to="/about" :class="$store.getters.theme") Contacts
        .flex.grow
          v-container(fluid fill-height)
            v-flex(fill-height)
              keep-alive
                router-view.view(:key="$route.fullPath" @block-height="heightBlocked = true" @unblock-height="heightBlocked = false")
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import Album from "@/components/Album.vue";
import Theme from "@/components/Theme.vue";
import Axios from "axios";
import Options from "@/components/Options.vue";
import { Bus } from "./event-bus";

const C = require("./api/consts");
const Api = require("./api/settings_api");
const StyleTemplate = require("./api/style").default;

export default {
  data() {
    return {
      post: false,
      uploading: false,
      tools: false,
      background: {}
    };
  },
  watch: {
    $route(to) {
      this.background = {};
      this.loadBackground(to.name);
      document.title = to.meta.title || 'Your Website'
    }
  },
  computed: {
    adminMode() {
      return this.$store.getters.isSuper;
    },
    environment(){
      return process.env.NODE_ENV;
    },
    assetsPath() {
      let path = process.env.VUE_APP_ASSETS_PATH;
      return path === undefined ? "" : path;
    },
    isAuth() {
      return this.$store.getters.isAuthenticated;
    },
    isDev() {
      return this.$store.getters.isDev;
    },
    breakpoint() {
      return this.$vuetify.breakpoint;
    }
  },
  methods: {
    async loadBackground(forRoute) {
      this.background = await Api.getValue(forRoute + "_background");
    },
    openEditor() {
      this.$dialog.show(Album, {
        title: "Create new album"
      });
    },
    openPageEditor() {
      this.$dialog.show(Options, {
        id: this.$route.name,
        fields: StyleTemplate,
        title: "Toggle dark theme"
      });
    },
    link() {
      let target = this.$router.currentRoute.name === "home" ? "/gallery" : "/";
      return target;
    },
    adminChange() {
      this.$store.dispatch(C.ADMIN_MODE_SWAP);
    },
    async logout() {
      await this.$store.dispatch(C.AUTH_LOGOUT);
      Bus.$emit("log-out");
    },
    resize(data) {
      let s = data.target.screen;
      Bus.$emit("window-resize");
      this.$store.dispatch(C.RESIZE, {
        availHeight: s.availHeight,
        height: s.height,
        orientation: {
          angle: s.orientation.angle,
          type: s.orientation.type
        }
      });
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
    console.log(process.env.NODE_ENV)
  },
  mounted() {
    window.addEventListener("resize", this.resize);
    this.resize({ target: window });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  },
  components: {
    Navigation,
    Album,
    Theme,
    Options
  }
};
</script>