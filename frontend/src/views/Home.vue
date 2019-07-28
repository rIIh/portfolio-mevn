<template lang="pug">
  v-layout(justify-center align-center fill-height)
    v-dialog(v-model="edit" max-width="450px" :persistent="uploading")
      voption(:opened="edit" type="image" property="home_background" @busy="uploading = true" @unbusy="uploading = false") 
    r-btn.home-button(v-if="adminMode" @click="edit = !edit") Change background image
</template>

<script>
const api = require("../api/settings_api");
const C = require("../api/consts");
import $ from "jquery";
import voption from "../components/Option";

export default {
  data() {
    return {
      background: {},
      uploading: false,
      edit: false
    };
  },
  computed: {
    adminMode() {
      return this.$store.getters.isSuper;
    }
  },
  methods: {
    applyStyles(clear) {
      if (clear === undefined) clear = false;
      if (clear) {
        this.$store.dispatch(C.THEME_CHANGE, 255);
        return;
      }
      if (this.background === "none") return;
      this.$store.dispatch(
        C.THEME_CHANGE,
        this.background.luminosity.brightness
      );
    }
  },
  components: { voption }
};
</script>

<style lang="sass">
.home-button
  transform: translate(0, -80px)
</style>