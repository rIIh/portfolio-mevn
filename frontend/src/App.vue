<template lang="pug">
  v-app#app()
    v-navigation-drawer(absolute v-model="tools" v-if="breakpoint.smAndDown && isAuth")
      v-list
        v-list-tile(@click="adminChange")
          v-list-tile-action
            v-checkbox(v-model="adminMode" readonly)
          v-list-tile-content 
            v-list-tile-title admin mode
        v-list-tile(@click="post = !post; tools = false")
          v-list-tile-action
            v-icon.material-icons-outlined attachment
          v-list-tile-content 
            v-list-tile-title post album
        v-list-tile(@click="logout")
          v-list-tile-action
            v-icon.material-icons-outlined exit_to_app
          v-list-tile-content 
            v-list-tile-title log out

    v-layout(justify-space-between align-baseline shrink style="padding: 24px; padding-bottom: 0")
      v-flex(shrink)
        v-icon.pr-3(@click.stop="tools = !tools" v-if="breakpoint.smAndDown && isAuth") menu
        router-link(:to="link()" class="main link")
          h1.brand(:class="$store.getters.theme" :style="breakpoint.smAndDown ? 'font-size: 24px' : ''") Yura&nbsp;Taralov
        template(v-if="isAuth && breakpoint.mdAndUp")
          span.no-wrap.px-3
            //- button.darkify.custom-btn.px-3(:class="adminMode ? 'pressed' : 'depressed'" @click="adminChange") admin mode
            r-btn.px-3(:pressed="adminMode" @click="adminChange") admin mode
            r-btn.px-3(@click="openEditor") post album
            r-btn.px-3(@click="logout") log out
            r-btn.pa-0()
              v-icon.material-icons-outlined(small) settings
      v-flex(shrink)
        router-link.link.about(to="/about") Contacts
    v-content
      v-container(fluid fill-height)
        v-flex(fill-height)
          router-view.view(@block-height="heightBlocked = true" @unblock-height="heightBlocked = false")
          
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import Album from "@/components/Album.vue";
import Axios from "axios";
import { Bus } from "./event-bus";

const C = require("./api/consts");

export default {
    data() {
        return {
            post: false,
            uploading: false,
            tools: false
        };
    },
    computed: {
        adminMode() {
            return this.$store.getters.isSuper;
        },
        isAuth() {
            return this.$store.getters.isAuthenticated;
        },
        breakpoint() {
            return this.$vuetify.breakpoint;
        }
    },
    methods: {
        openEditor() {
            this.$dialog.show(Album);
        },
        link() {
            let target =
                this.$router.currentRoute.name === "home" ? "/gallery" : "/";
            return target;
        },
        showMessage() {
            this.success = true;
            setTimeout(() => (this.success = false), 2000);
        },
        adminChange() {
            this.$store.dispatch(C.ADMIN_MODE_SWAP);
        },
        async logout() {
            await this.$store.dispatch(C.AUTH_LOGOUT);
            console.log("logut");
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
                if (
                    err.status === 401 &&
                    err.config &&
                    !err.config.__isRetryRequest
                ) {
                    // if you ever get an unauthorized, logout the user
                    this.$store.dispatch(AUTH_LOGOUT);
                    // you can also redirect to /login if needed !
                }
            });
        });
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
        Album
    }
};
</script>