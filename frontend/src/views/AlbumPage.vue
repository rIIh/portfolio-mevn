<template lang="pug">
  #album(v-if="album !== undefined")
    h1(v-tooltip="'Название альбома'") {{album.name}}
    img(v-tooltip="'Обложка альбома'" class="photo" :src="assetsPath + album.photos[album.coverIndex].path" alt="photo from album")
    h2 Тут будут фото
    h3 Как это будет выглядеть?
</template>

<script>
export default {
  data() {
    return {
      id: -1,
      album: undefined
    };
  },
  computed: {
    assetsPath() {
      let path = process.env.VUE_APP_ASSETS_PATH;
      return path === undefined ? "" : path;
    }
  },
  methods: {
    async loadAlbum() {
      let res = await this.$axios.get("api/albums/" + this.id);
      this.album = res.data;
    }
  },
  mounted() {
    this.id = this.$route.params.id;
    this.loadAlbum();
  }
};
</script>


<style lang="scss">
.photo {
  padding: 32px;
  width: 80vw;
  max-width: 800px;
}
</style>
