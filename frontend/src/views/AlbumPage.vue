<template lang="pug">
  #album
    h1 {{photo.name}}
    img(class="photo" :src="photo.path" alt="photo from album")
</template>

<script>
import Axios from "axios";
export default {
  data() {
    return {
      id: -1,
      photo: {}
    };
  },
  computed: {
    assetsPath() {
      let path = process.env.VUE_APP_ASSETS_PATH;
      return path === undefined ? "" : path;
    }
  },
  methods: {
    async loadPhoto() {
      let res = await Axios.get("api/photos/" + this.id);
      this.photo = res.data;
      this.photo.path = this.assetsPath + this.photo.path;
    }
  },
  mounted() {
    this.id = this.$route.params.id;
    this.loadPhoto();
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
