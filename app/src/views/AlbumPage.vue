<template lang="pug">
  .layout.fill-height.column.justify-space-around.align-content-space-between(v-if="album")
    .spacer
    .flex(style="flex-grow: 4 !important")
      .card.flat(@click="$router.go(-1)" style="height: 100%; position: relative; overflow-y: hidden;")
        transition-group(name="long-fade")
          img.photo.slide(v-for="(photo, index) in album.photos" :src="assetsPath + photo.path" v-show="index === currentIndex" :key="index" alt="photo" @click.stop="increment")
          //img.photo.slide(:src="assetsPath + album.photos[currentIndex].path" :key="currentIndex" alt="photo" @click.stop="increment")
          //img.photo(:style="orientation" style="position: absolute; top: 50%; transform: translate(-50%, -50%)" :src="assetsPath + album.photos[currentIndex].path" :key="currentIndex" alt="photo" @click.stop="increment(); skip=true")
    .flex.shrink
      .pages.ma-3
        template(v-for="n in album.photos.length")
          span.page.unselectable.pa-2(:class="currentIndex === n - 1 ? 'active' : ''" @click.stop="currentIndex = n - 1; skip = true" :key="n") {{ n }}
    .spacer
</template>
<style lang="scss">
.slide{
    position: absolute;
    max-width: 100%;
    max-height: 100%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.long-fade-enter-active,
.long-fade-leave-active {
    transition: opacity 2s;
}

.long-fade-enter, .long-fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0;
}

.page {
    transition: color 1s;
    color: black;
    cursor: pointer;
    &.active {
        color: white;
    }
    &:hover {
        border-bottom: 1px solid currentColor;
    }
}
</style>

<script>
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export default {
    data() {
        return {
            id: -1,
            currentIndex: 0,
            album: undefined,
            skip: false
        };
    },
    asyncData({ params }) {
        console.log(params);
    },
    props: {},
    computed: {
        assetsPath() {
            let path = process.env.VUE_APP_ASSETS_PATH;
            return path === undefined ? "" : path;
        },
        orientation() {
            switch (this.$store.getters.window.screen.orientation.angle) {
                case 0:
                    return {
                        width: "100%",
                        "max-height": "100%"
                    };
                    break;

                default:
                    return {
                        height: "100%",
                        "max-width": "100%"
                    };
                    break;
            }
        }
    },
    methods: {
        increment() {
            this.currentIndex++;
            if (this.currentIndex >= this.album.photos.length)
                this.currentIndex = 0;
        },
        async loadAlbum() {
            let res = await this.$axios.get("api/albums/" + this.id);
            this.album = res.data;
        },
        async next() {
            if (!this.skip) this.increment();
            else this.skip = false;
            await timeout(3500);
            this.next();
        }
    },
    beforeRouteLeave(to, from, next) {
        this.$emit("unblock-height");
        next();
    },
    beforeMount() {
        this.$emit("block-height");
    },
    created() {
        this.id = this.$route.params.id;
        this.loadAlbum().then();
    }
};
</script>