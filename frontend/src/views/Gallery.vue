<template lang="pug">
  .home(id="scroll-target" v-scroll="onScroll" :style="breakpoint.mdAndUp ? 'max-height ' : ''")
    v-dialog(v-model="edit" :persistent="uploading" max-width="450px")
      album(:was="model" ref="editor" @busy="uploading = true" @unbusy="uploading = false") Edit album
    v-layout(fill-height v-if="breakpoint.mdAndUp" row)
      v-flex(shrink)
        v-layout.nav_side(column fill-height)
          div(class="link_row" shrink v-for="(album, index) in albums" :key="album.name" @mouseenter="mouseEnterLink(index)" @mouseleave="mouseExitLink(index)" v-show="adminMode || !album.hidden")
            span.link-box(@mouseenter="openAndTop(index)")
              router-link(class="link" :to="'album_'+album.name")
                a(:style="{'text-decoration': album.hidden ? 'line-through' : 'none', 'overflow-x': adminMode ? 'hidden' : ''}"  ) {{ album.name }}
            transition(name="fade")
              span(v-if="adminMode" v-show="album.mouseOverLink")
                button(@click="openEditor(index)" @mouseenter="openAndTop(index)")
                  v-icon.material-icons-outlined edit
                button(@click="swapVisible(index); updateVisibility(index)" @mouseenter="openAndTop(index)")
                  v-icon.material-icons-outlined {{ !albums[index].hidden ? 'visibility' : 'visibility_off' }}
      v-flex.pl-2(grow style="overflow: hidden; position: relative" ref="stack_parent")
        .photo_container_stack(ref="photo_stack_container")
          img(v-for="(album, index) in albums" v-show="album.topped && (!album.hidden || adminMode)"  :key="index" :src="assetsPath + album.photos[album.coverIndex].path" ref="photo_stack")

    .photo_container(v-else)
      v-card(flat tile v-for="(album, index) in albums" :key="albums.name" v-show="!album.hidden || adminMode"  @click.stop="hoveredIndex=index")
        template(v-if="adminMode")
          //- transition(name="fade" v-if="adminMode")
          span.overlay.cover(v-show="hoveredIndex === index")
            .overlay.disable-select(style="height: 50%; width: 50%" @click="openEditor(index)")
              v-icon.overlay_item.centered.material-icons-outlined() edit
            .overlay.disable-select(style="height: 50%; width: 50%; transform: translate(100%, 0)" @click="swapVisible(index); updateVisibility(index)")
              v-icon.overlay_item.centered.material-icons-outlined {{ !albums[index].hidden ? 'visibility' : 'visibility_off' }}
            router-link.overlay.disable-select(:to="'album_'+album.name" style="height: 50%; transform: translate(0, 100%)")
              v-icon.overlay_item.centered.material-icons-outlined() arrow_forward
          img(:src="assetsPath + album.photos[album.coverIndex].path" )
        router-link(:to="'album_'+album.name" v-else)
            img(:src="assetsPath + album.photos[album.coverIndex].path" )
</template>

<script>
// @ is an alias to /src
import Album from "@/components/Album.vue";

const api = require("../api/gallery_api");

import { Bus } from "@/event-bus.js";

export default {
    name: "home",
    data() {
        return {
            albums: [],
            model: {},
            stack: {},
            hoveredIndex: -1,
            offset: 0,
            edit: false,
            uploading: false
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
    methods: {
        onScroll(e) {
            // this.offset = e.target.scrollingElement.scrollTop;
        },
        openEditor(index) {
            // this.edit = true;
            this.model = JSON.parse(JSON.stringify(this.albums[index]));
            this.$dialog.show(Album, {
                propsData: {
                    was: JSON.parse(JSON.stringify(this.albums[index]))
                }
            });
        },
        updateVisibility(index) {
            api.updateAlbum({
                _id: this.albums[index]._id,
                hidden: this.albums[index].hidden
            });
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
                    top: 0
                };
            });
        },
        openPublishModal() {
            this.$refs.publish.open();
        },
        handleResize() {
            var photo_stack = this.$refs.photo_stack_container;
            var parent = this.$refs.stack_parent;
            if (photo_stack === undefined || parent === undefined) return;
            photo_stack.style.width = parent.clientWidth + "px";
            photo_stack.style.height = parent.clientHeight + "px";
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
                    this.albums[index].position.left *
                    (this.stack.width - t.clientWidth);
                //top
                let top =
                    this.albums[index].position.top *
                    // (this.stack.height - t.clientHeight);
                    this.stack.height;
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
        Bus.$on("window-resize", this.handleResize);
        Bus.$on("album-db-changed", this.getAlbums);
        Bus.$on("log-out", this.getAlbums);
    },
    updated() {
        this.handleResize();
    },
    beforeDestroy() {
        Bus.$off("album-db-changed", this.getAlbums);
        Bus.$off("window-resize", this.handleResize);
        Bus.$off("log-out", this.getAlbums);
    },
    components: {
        Album
    }
};
</script>

<style lang="scss">
.photo_container {
    width: 100%;
    max-width: 100%;
    transition: 0.5s;
    column-gap: 0px;
    line-height: 0px;

    columns: 2;

    img {
        transition: 1s;
        padding: 3px;
        width: 100%;
    }
}

.photo_container_stack {
    height: 100%;
    width: 100%;
    position: fixed;
    top: 50%;
    img {
        position: absolute;
        transform: translateY(-50%);
        min-height: 128px;
        height: 80vh;
        max-height: 512px;
    }
}

.nav_side {
    padding-top: 10%;
    display: inline;
    transition: 0.5s;

    .link_row,
    .eva-hover {
        text-align: start !important;
    }

    .link-box {
        &:hover {
            a {
                padding-left: 10px;
                color: lightgrey;
            }
        }
    }
    a {
        color: grey;
    }
    .link_row {
        justify-content: space-between;
        flex-direction: row;
        display: flex;
        width: 150px;
        height: 30px;
        transition: 0.35s;
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