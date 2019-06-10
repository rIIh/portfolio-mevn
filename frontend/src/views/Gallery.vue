<template lang="pug">
  .home
    v-dialog(v-model="edit" max-width="450px")
      album(:was="model" ref="editor" @uploaded="showMessage" @done="edit = !edit") Edit album
    v-snackbar(color="primary" v-model="success") Album successully uploaded
      v-btn(dark flat @click.native="success = false") Close
    v-layout(fill-height v-if="breakpoint.mdAndUp")
      v-flex(shrink)
        v-layout.nav_side(column)
          div(class="link_row" v-for="(album, index) in albums" :key="album.name" @mouseenter="mouseEnterLink(index)" @mouseleave="mouseExitLink(index)" v-show="adminMode || !album.hidden")
            router-link(class="link" :to="'album_'+album.name" @mouseenter.native="openAndTop(index)")
              a(:style="{'text-decoration': album.hidden ? 'line-through' : 'none', 'overflow-x': adminMode ? 'hidden' : ''}") {{ album.name }}
            transition(name="fade")
              span(v-if="adminMode" v-show="album.mouseOverLink")
                button(@click="openEditor(index)")
                  v-icon edit
                button(@click="swapVisible(index)")
                  v-icon {{ !albums[index].hidden ? 'visibility' : 'visibility_off' }}
      v-flex.px-5.py-0
        .photo_container_stack(ref="photo_stack_container")
          img(v-for="(album, index) in albums" v-show="album.topped"  :key="index" :src="assetsPath + album.photos[album.coverIndex].path" ref="photo_stack")


    //- aside(class="nav_side")
    //-   nav(class="photo_nav" v-if="albums !== undefined")
    //-     //- router-link(class="link" :to="'album_'+album.name" v-for="(album, index) in albums" :key="album.name" @mouseenter.native="openAndTop(index)" )
    //-     //-   a {{ album.name }}
    //-     div(class="link_row" v-for="(album, index) in albums" :key="album.name")
    //-       router-link(class="link" :to="'album_'+index" @mouseenter.native="openAndTop(index)" )
    //-         a {{ album.name }}
    //-       transition(name="fade")
    //-         span(v-if="adminMode")
    //-           eva-icon(name="edit-outline" class="click" animation="flip")
    //-           eva-icon(:name="albums[index].visible ? 'eye-outline' : 'eye-off-outline'"  @click="swapVisible(index)" class="click" animation="flip" v-tooltip="'Если установлено скрыто, то в списке не появится у обычного пользователя, реализую позже'")
    .photo_container(v-else)
      div(v-for="(album, index) in albums" :key="albums.name")
        router-link(:to="'album_'+album.name")
          img(:src="assetsPath + album.photos[album.coverIndex].path")
</template>

<script>
// @ is an alias to /src
import CAside from "@/components/CustomAside";
import PostForm from "@/components/PostForm";
import Multifile from "@updivision/vue2-multi-uploader";
import ScrollBar from "vue2-scrollbar";
import Album from "@/components/Album.vue";

import { SweetModal, SweetModalTab } from "sweet-modal-vue";
const api = require("../api/gallery_api");

import { EventBus } from "@/event-bus.js";

export default {
  name: "home",
  data() {
    return {
      albums: [],
      model: {},
      stack: {},
      edit: false,
      success: false
    };
  },
  computed: {
    assetsPath() {
      let path = process.env.VUE_APP_ASSETS_PATH;
      return path === undefined ? "" : path;
    },
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
  updated() {
    this.position();
  },
  beforeRouteLeave(to, from, next) {
    this.leaving();
    next();
  },
  methods: {
    showMessage() {
      this.success = true;
      setTimeout(() => (this.success = false), 2000);
    },
    openEditor(index) {
      this.edit = true;
      this.model = JSON.parse(JSON.stringify(this.albums[index]));
    },
    leaving() {
      api.updateAlbums(this.albums, this.$axios);
    },
    swapVisible(index) {
      this.albums[index].hidden = !this.albums[index].hidden;
      this.$forceUpdate();
    },
    async getAlbums() {
      this.albums = await api.getAlbums(this.$axios);
      this.albums.forEach(a => {
        a.topped = false;
        a.mouseOverLink = false;
        a.position = {
          left: Math.random(),
          top: Math.random()
        };
      });
    },
    openPublishModal() {
      this.$refs.publish.open();
    },
    handleResize() {
      var photo_stack = this.$refs.photo_stack_container;
      if (photo_stack === undefined) return;
      this.stack = {
        width: photo_stack.clientWidth,
        height: photo_stack.clientHeight
      };
      this.position();
    },
    position() {
      var photo_stack = this.$refs.photo_stack;
      if (photo_stack === undefined) return;
      photo_stack.forEach((t, index) => {
        //left
        let left =
          this.albums[index].position.left * (this.stack.width - t.clientWidth);
        //top
        let top =
          this.albums[index].position.top *
          (this.stack.height - t.clientHeight);
        t.style.left = Math.floor(left).toString() + "px";
        t.style.top = Math.floor(top).toString() + "px";
      });
    },
    mouseEnterLink(i) {
      let alb = this.albums[i];
      alb.mouseOverLink = true;
      this.$set(this.albums, i, alb);
    },
    mouseExitLink(i) {
      let alb = this.albums[i];
      alb.mouseOverLink = false;
      this.$set(this.albums, i, alb);
    },
    // ! Possible run out of memory exception
    openAndTop(i) {
      var photo_stack = this.$refs.photo_stack;
      if (photo_stack === undefined) return;
      let max = 0;
      photo_stack.forEach((t, index) => {
        max = Math.max(max, t.style.zIndex);
      });
      if (photo_stack[i].style.zIndex === max) return;
      photo_stack[i].style.zIndex = max + 1;

      let alb = this.albums[i];
      alb.topped = true;
      this.$set(this.albums, i, alb);
    }
  },
  mounted() {
    this.getAlbums();
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("beforeunload", this.leaving);
    EventBus.$on("album-db-changed", this.getAlbums);
  },
  updated() {
    this.handleResize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("beforeunload", this.leaving);
    EventBus.$off("album-db-changed", this.getAlbums);
    this.leaving();
  },
  components: {
    SweetModal,
    SweetModalTab,
    PostForm,
    Multifile,
    Album
  }
};
</script>

<style lang="scss">
section.has-text-centered {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.photo_container {
  width: 100%;
  max-width: 100%;
  transition: 0.5s;
  column-gap: 0px;

  columns: 2;

  img {
    transition: 1s;
    padding: 3px;
    width: 100%;
  }
}

.photo_container_stack {
  height: 100%;
  overflow: hidden;
  position: relative;
  img {
    position: absolute;
    max-height: 520px;
  }
}

.nav_side {
  overflow-x: hidden;
  padding-top: 60px;
  display: inline;
  transition: 0.5s;

  .link_row,
  .eva-hover {
    text-align: start !important;
  }
  .link_row {
    justify-content: space-between;
    flex-direction: row;
    display: flex;
    width: 150px;

    a.link {
      padding: 0;
    }

    a {
      text-decoration: none;
      font-size: 16px;
      color: grey;
      display: block;
      transition: 0.3s;
      text-align: start;
      max-width: 100px;

      &:hover {
        color: lightgrey;
        padding-left: 10px;
      }
      cursor: pointer;
    }
  }

  .closebtn {
    position: absolute;
    top: 0;
    right: 25px;
    font-size: 36px;
    margin-left: 50px;
  }
}
.home {
  height: 100%;
  max-height: 100%;
}
</style>