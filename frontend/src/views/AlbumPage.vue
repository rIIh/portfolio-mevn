<template lang="pug">
  v-layout(fill-height column justify-space-around align-content-space-between v-if="album")
    v-flex(grow)
      v-card(flat @click="$router.go(-1)" height="100%" style=" position: relative; overflow-y: hidden;")
        transition(name="fade")
          img.photo(style="position: absolute; max-width: 100%; max-height: 100%; top: 50%; transform: translate(-50%, -50%)" :src="assetsPath + album.photos[currentIndex].path" :key="currentIndex" alt="photo" @click.stop="increment(); skip=true")
          //- img.photo(:style="orientation" style="position: absolute; top: 50%; transform: translate(-50%, -50%)" :src="assetsPath + album.photos[currentIndex].path" :key="currentIndex" alt="photo" @click.stop="increment(); skip=true")
    v-flex(shrink)
      .pages.ma-3
        template(v-for="n in album.photos.length")
          span.page.pa-2(:class="currentIndex === n - 1 ? 'active' : ''" @click.stop="currentIndex = n - 1; skip = true" :key="n") {{ n }}
</template>

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
      if (this.currentIndex >= this.album.photos.length) this.currentIndex = 0;
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
  mounted() {
    this.id = this.$route.params.id;
    this.loadAlbum().then(this.next);
  }
};
</script>


<style lang="scss">
.page {
  transition: color 0.5s;
  color: black;
  &.active {
    color: white;
  }
}
</style>
