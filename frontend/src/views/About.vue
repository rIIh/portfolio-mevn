<template lang="pug">
  #about
    r-btn(v-if="adminMode" @click="edit = !edit") Change background image
    r-btn(v-if="adminMode" @click="edit = !edit") Edit text
    ckeditor(:editor="editor" v-model="editorData" :config="editorConfig")
    span(v-html="editorData")
    v-dialog(v-model="edit" max-width="450px" :persistent="uploading")
          voption(:opened="edit" type="image" property="about_background" @done="getBG" @busy="uploading = true" @unbusy="uploading = false")
</template>

<script>
const api = require("../api/settings_api");
const C = require("../api/consts");
import $ from "jquery";
import voption from "../components/Option";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
ClassicEditor.builtinPlugins.map(plugin => console.log(plugin.pluginName));

export default {
  data() {
    return {
      background: "",
      initial: "",
      uploading: false,
      edit: false,

      editor: ClassicEditor,
      editorData: "<p>Content of the editor.</p>",
      editorConfig: {
        // The configuration of the editor.
      }
    };
  },
  computed: {
    assetsPath() {
      let path = process.env.VUE_APP_ASSETS_PATH;
      return path === undefined ? "" : path;
    },
    adminMode() {
      return this.$store.getters.isSuper;
    }
  },
  methods: {
    async getBG() {
      this.background = await api.getValue("about_background");
    },
    applyStyles(clear) {
      if (clear === undefined) clear = false;
      if (this.background === "none") return;
      this.$store.dispatch(
        C.THEME_CHANGE,
        this.background.luminosity.brightness
      );
    }
  },
  watch: {
    background: function(newVal, old) {
      $("body").css(
        "background-image",
        'url("' + this.assetsPath + newVal.path + '")'
      );
      this.applyStyles();
    }
  },
  beforeRouteLeave(to, from, next) {
    $("body").css("background-image", this.initial);
    this.applyStyles(true);
    next();
  },
  mounted() {
    this.initial = $("body").css("background-image");
    this.getBG();
  },
  components: { voption }
};
</script>
