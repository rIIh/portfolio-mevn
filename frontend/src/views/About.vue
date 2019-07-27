<template lang="pug">
  #about
    r-btn(v-if="adminMode" @click="openBackgroundEditor") Change background image
    r-btn(v-if="adminMode" @click="showAboutEditor = !showAboutEditor") Edit text
    .editor-container(v-if="showAboutEditor && adminMode")
        quill-editor(ref="myTextEditor" v-model="content" :options="editorOption")
        // r-async-editor()
                      
    span.about-content.fill-height(v-html="content")
</template>
<style lang="sass">
.ql-save
  width: 48px !important
.ql-save:after
  content: 'Save'

.editor-container
  background: white

.ql-snow.ql-toolbar button:hover .ql-fill, .ql-snow .ql-toolbar button:hover .ql-fill, .ql-snow.ql-toolbar button:focus .ql-fill, .ql-snow .ql-toolbar button:focus .ql-fill, .ql-snow.ql-toolbar button.ql-active .ql-fill, .ql-snow .ql-toolbar button.ql-active .ql-fill, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill, .ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill, .ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill, .ql-snow.ql-toolbar button:focus .ql-stroke.ql-fill, .ql-snow .ql-toolbar button:focus .ql-stroke.ql-fill, .ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill, .ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill
    fill: white
    background: black
.ql-snow.ql-toolbar button:hover .ql-stroke, .ql-snow .ql-toolbar button:hover .ql-stroke, .ql-snow.ql-toolbar button:focus .ql-stroke, .ql-snow .ql-toolbar button:focus .ql-stroke, .ql-snow.ql-toolbar button.ql-active .ql-stroke, .ql-snow .ql-toolbar button.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow.ql-toolbar button:hover .ql-stroke-miter, .ql-snow .ql-toolbar button:hover .ql-stroke-miter, .ql-snow.ql-toolbar button:focus .ql-stroke-miter, .ql-snow .ql-toolbar button:focus .ql-stroke-miter, .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter
    stroke: white
    background: black
.ql-snow.ql-toolbar button:hover, .ql-snow .ql-toolbar button:hover, .ql-snow.ql-toolbar button:focus, .ql-snow .ql-toolbar button:focus, .ql-snow.ql-toolbar button.ql-active, .ql-snow .ql-toolbar button.ql-active, .ql-snow.ql-toolbar .ql-picker-label:hover, .ql-snow .ql-toolbar .ql-picker-label:hover, .ql-snow.ql-toolbar .ql-picker-label.ql-active, .ql-snow .ql-toolbar .ql-picker-label.ql-active, .ql-snow.ql-toolbar .ql-picker-item:hover, .ql-snow .ql-toolbar .ql-picker-item:hover, .ql-snow.ql-toolbar .ql-picker-item.ql-selected, .ql-snow .ql-toolbar .ql-picker-item.ql-selected
    color: white
    background: black
</style>

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
        async openBackgroundEditor(){
            await this.$dialog.show(voption, {
                type: 'image',
                property: "about_background",
                waitForResult: true
            });
            this.getBG()
        },
        async saveContent() {
            let res = await api.setValue("about_content", {
                parse: true,
                value: JSON.stringify(this.content)
            });
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
    },
    watch: {
        background: function(newVal, old) {
            $("body").css(
                "background-image",
                'url("' + this.assetsPath + newVal.path + '")'
            );
        }
    },
    beforeRouteLeave(to, from, next) {
        $("body").css("background-image", this.initial);
        next();
    },
    created() {
        this.initial = $("body").css("background-image");
        this.loadContent();
        this.getBG();
    },
    components: { voption }
};
</script><style lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0;
}

/*Wrapper*/
.my-scrollbar {
    // width: 35%;
    // min-width: 300px;

    max-height: 90vh;
    color: aqua;
}
.photos {
    line-height: 0;
    .photo{
        position: relative;
    }
}

.upload_image {
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.remove_btn {
    position: absolute;
    top: 0;
    right: 0;

    // background-color: #ff6b51;
    background-color: black;
}

.overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    transition: 0.5s ease;
    z-index: 0;

    &.cover {
        background-color: rgba(255, 255, 255, 0.637);
    }
    &.remove {
        background-color: rgba(255, 51, 0, 0.479);
    }
    .overlay_item {
        z-index: 100;
        &.centered {
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            text-align: center;
        }
    }
}
</style>
