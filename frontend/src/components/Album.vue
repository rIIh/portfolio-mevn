<template lang="pug">
  .album-editor
    vue-scrollbar.my-scrollbar(ref="Scrollbar")
      .card.scroll-me
        .v-card__title
          .container.pb-0.grid-list-md
            .layout.justify-start
              span.headline {{title}}
        .v-card__text
          .container.grid-list-md.pt-0
            .layout.column.justify-center
              v-form(ref="form" v-model="formValid" @submit.prevent="was ? update() : upload()")
                .flex.pa-0()
                  v-text-field(label="Title"  v-model="model.name" ref="name" :rules="nameRules" required)
                .layout.wrap.fill-height.photos()
                  .flex.xs4(v-for="(photo, index) in model.photos" xs4)
                    .card.flat.tile.disable-select.photo(@click="model.coverIndex = index")
                      transition(name="fade")
                        .overlay.cover(v-show="index === model.coverIndex")
                          v-icon.overlay_item.centered.material-icons-outlined() done
                      button.remove_btn(@click.prevent.stop="removePhoto(index)")
                        v-icon(dark) clear
                      img(:src="(editing && !photo.file) ? assetsPath + photo.path : photo.path" :key="index" width="100%")
                v-alert(type="error" outline :value="model.photos[0] === undefined") At least one photo is required
                
                .layout.justify-space-between.fluid
                  .flex.shrink(v-if="was")
                    r-btn.ma-0(ignoreTheme @click="remove") Remove
                  .spacer(v-else)
                  .flex.shrink
                    r-btn.ma-0(ignoreTheme @click="pickPhotos") Select photos
                  .flex.shrink
                    r-btn.ma-0(ignoreTheme :disabled="!valid" :loading="busyVal" :progress="busyProgress" @click="was ? update() : upload()") {{ editing ? 'Update' : 'Upload'}}
                input(type="file" style="display: none" ref="photo_picker" multiple accept="image/*" @change="onPhotosPicked")
</template>

<style lang="scss">
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


<script>
import VueScrollbar from "vue2-scrollbar";
const C = require("../api/consts");
const Api = require("../api/gallery_api");
import { Bus } from "@/event-bus.js";

export default {
    data() {
        return {
            nameRules: [v => !!v || "Name is required"],
            formValid: false,
            hoveredIndex: -1,
            model: {
                name: "",
                coverIndex: 0,
                photos: []
            },
            busyVal: false,
            busyProgress: 0,
        };
    },
    props: {
        was: Object,
        title: String,
    },
    watch: {
        was: function(newVal, oldVal) {
            this.model = JSON.parse(JSON.stringify(newVal));
        }
    },
    mounted(){
        this.model = JSON.parse(JSON.stringify(this.was));
    },
    computed: {
        valid() {
            return this.formValid && this.model.photos[0] !== undefined;
        },
        assetsPath() {
            let path = process.env.VUE_APP_ASSETS_PATH;
            return path === undefined ? "" : path;
        },
        editing() {
            return this.was !== undefined;
        },
    },
    methods: {
        busy(value) {
            this.busyVal = value;
            this.$emit(value ? "busy" : "unbusy");
        },
        removePhoto(i) {
            this.model.photos.splice(i, 1);
            let ci = this.model.coverIndex;
            console.log(i, this.model.coverIndex);
            // if (this.model.coverIndex > i && this.model.coverIndex !== 0) this.model.coverIndex--;
            if (ci > i || (ci === i && ci !== 0)) this.model.coverIndex--;
        },
        newPost() {
            this.post = true;
        },
        pickPhotos() {
            this.$refs.photo_picker.click();
        },
        onPhotosPicked(e) {
            const files = Array.from(e.target.files);
            this.model.coverIndex = 0;
            files.forEach(element => {
                const reader = new FileReader();
                reader.readAsDataURL(element);
                reader.addEventListener("load", () => {
                    let photo = {};
                    photo.path = reader.result;
                    photo.file = element;
                    this.model.photos.push(photo);
                });
            });
        },
        async upload() {
            this.$refs.form.validate();
            if (this.busyVal || !this.valid) return;
            this.busy(true);

            var response = await Api.uploadAlbum(
                this.model,
                data => (this.busyProgress = data)
            ).catch(err => {
                this.busy(false);
                if (err.status === 400) {
                    console.log(err);
                }
            });
            this.busy(false);

            if (response.status === 200) {
                this.$emit("submit");
                Bus.$emit("album-db-changed");
                this.$dialog.message.info("Album successfully uploaded", {
                    position: "top"
                });
                this.model = {
                    name: "",
                    coverIndex: 0,
                    photos: []
                };
            }
        },
        async update() {
            this.$refs.form.validate();
            if (this.busyVal || !this.formValid) return;
            this.busy(true);

            if (this.valid) {
                var ofs = JSON.parse(JSON.stringify(this.model));
                var savedCoverHash = ofs.photos[ofs.coverIndex].hash;
                if (savedCoverHash === undefined)
                    savedCoverHash = ofs.photos[ofs.coverIndex].file;

                var files = this.model.photos
                    .filter(p => p.file !== undefined)
                    .map(p => p.file);
                ofs.photos = ofs.photos.filter(p => p.file === undefined);

                var response = await Api.updateAlbum(ofs).catch(err => {
                    if (err.status === 400) {
                        console.log(err);
                    }
                });
                if (response.status !== 200) console.log("error");

                if (files[0] !== undefined) {
                    var response = await Api.sendNewAlbumPhotos(
                        ofs._id,
                        files,
                        data => (this.busyProgress = data)
                    ).catch(err => {
                        this.busy(false);

                        if (err.status === 400) {
                            console.log(err);
                        }
                    });
                    if (response.status !== 200) console.log("error");
                }
                this.busy(false);
                this.$emit("submit");
                Bus.$emit("album-db-changed");
                this.$dialog.message.info("Album successfully updated", {
                    position: "top"
                });
                this.model = {
                    name: "",
                    coverIndex: 0,
                    photos: []
                };
            }
        },
        async remove() {
            if (this.busyVal) return;
            this.busy(true);

            var response = await Api.removeAlbum(this.was).catch(err =>
                console.log(err)
            );
            if (response.status === 200) {
                this.busy(false);
                this.$emit("submit");
                Bus.$emit("album-db-changed");
            }
        }
    },
    components: { VueScrollbar }
};
</script>

