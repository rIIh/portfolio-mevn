<template lang="pug">
  #about
    r-btn(v-if="adminMode" @click="showBackgroundEditor = !showBackgroundEditor") Change background image
    r-btn(v-if="adminMode" @click="showAboutEditor = !showAboutEditor") Edit text
    //- ckeditor(v-if="showAboutEditor" :editor="editor" v-model="editorData" :config="editorConfig")
    //- @blur="onEditorBlur($event)"
    //- @focus="onEditorFocus($event)"
    //- @ready="onEditorReady($event)"
    .editor-container(v-if="showAboutEditor && adminMode")
      quill-editor(ref="myTextEditor" v-model="content" :options="editorOption")
                      
    span(v-html="content")


    v-dialog(v-model="showBackgroundEditor" max-width="450px" :persistent="uploading")
          voption(:opened="showBackgroundEditor" type="image" property="about_background" @done="getBG" @busy="uploading = true" @unbusy="uploading = false")
</template>

<script>
const api = require("../api/settings_api");
const C = require("../api/consts");
import $ from "jquery";
import voption from "../components/Option";

function escapeQuotes(string) {
    return string.replace(/\\([\s\S])|(")/g, "\\$1$2");
}

export default {
    data() {
        const self = this;
        return {
            background: "",
            initial: "",
            uploading: false,
            showBackgroundEditor: false,
            showAboutEditor: false,

            content: ``,
            editorOption: {
                theme: "snow",
                modules: {
                    toolbar: {
                        container: [
                            ["bold", "italic", "underline"],
                            ["link"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            [{ header: 1 }, { header: 2 }],
                            [{ indent: "-1" }, { indent: "+1" }],
                            [{ size: ["small", false, "large", "huge"] }],
                            [{ header: [1, 2, 3, 4, 5, 6, false] }],
                            [{ color: [] }, { background: [] }],
                            [{ align: [] }],
                            ["clean"],
                            ["save"]
                        ],
                        handlers: {
                            save: function() {
                                self.saveContent();
                            }
                        }
                    },
                    syntax: {
                        highlight: text => hljs.highlightAuto(text).value
                    }
                }
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
        async saveContent() {
            let res = await api.setValue("about_content", {
                parse: true,
                value: JSON.stringify(this.content)
            });
            // let res = await api.setValue("about_content", this.content);
            if (res.status === 200) {
                this.$dialog.message.info("Text successfully saved", {
                    position: "top"
                });
            } else {
                console.log(res);
                this.$dialog.message.error("Something goes wrong", {
                    position: "top-right"
                });
            }
        },
        async loadContent() {
            this.content = await api.getValue("about_content");
        },
        async getBG() {
            this.background = await api.getValue("about_background");
        },
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
        this.loadContent();
        this.getBG();
    },
    components: { voption }
};
</script>

<style lang="sass">
.ql-snow.ql-toolbar button:hover
  color: black
.ql-save
  width: 48px !important
.ql-save:after
  content: 'Save'
  

.editor-container
  background: white
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow.ql-toolbar button.ql-active .ql-stroke
  stroke: white !important
  background: black !important

.ql-snow.ql-toolbar .ql-picker-label.ql-active, .ql-snow.ql-toolbar button.ql-active, .ql-snow.ql-toolbar button:hover
  color: white !important
  background: black !important 

.ql-snow.ql-toolbar button.ql-active
  .ql-fill
    fill: white !important
  background: black !important

.ql-active
  color: white
  fill: white
  background: black
</style>

