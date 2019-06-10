<template lang="pug">
    v-card
        v-card-title
            span.headline
                slot
        v-card-text
            v-container(grid-list-md)
                v-layout(column justify-center)
                    v-form(ref="form" v-model="formValid")
                        v-flex()
                            v-text-field(label="Name" v-model="model.name" ref="name" :rules="nameRules" required)
                        v-layout(wrap)
                            v-flex(v-for="(photo, index) in model.photos" xs4 d-flex)
                                v-card(flat tile @click="model.coverIndex = index")
                                    transition(name="fade")
                                        .overlay(v-show="index === model.coverIndex")
                                            v-icon(dark) done
                                    button.remove_btn(@click.stop="removePhoto(index)")
                                        v-icon(dark) clear
                                    img(:src="(editing && !photo.file) ? assetsPath + photo.path : photo.path" :key="index" width="100%")
                        v-alert(type="error" outline :value="model.photos[0] === undefined") At least one photo is required
                        
                        v-btn(round @click="pickPhotos") Select photos

                        input(type="file" style="display: none" ref="photo_picker" multiple accept="image/*" @change="onPhotosPicked")

            v-layout(:justify-space-between="editing" :justify-end="!editing" fluid)
                v-flex(xs4 v-show="was")
                    v-btn(round color="error" @click="remove") Remove
                v-flex(xs4)
                    v-btn(round :disabled="!valid" color="info" @click="was ? update() : upload()") {{ editing ? 'Update' : 'Upload'}}
</template>

<script>
const C = require("../api/consts");
const Api = require("../api/gallery_api");
import { EventBus } from "@/event-bus.js";

export default {
  data() {
    return {
      nameRules: [v => !!v || "Name is required"],
      formValid: false,
      model: {
        name: "",
        coverIndex: 0,
        photos: []
      }
    };
  },
  watch: {
    was: function(newVal, oldVal) {
      this.model = JSON.parse(JSON.stringify(newVal));
    }
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
    }
  },
  props: {
    was: Object
  },
  methods: {
    removePhoto(i) {
      this.model.photos.splice(i, 1);
      if (this.model.coverIndex >= i) this.model.coverIndex--;
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
      this.model.photos = [];
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

      if (this.valid) {
        var response = await Api.uploadAlbum(this.model).catch(err => {
          if (err.status === 400) {
            console.log(err);
          }
        });
        if (response.status === 200) {
          this.$emit("uploaded");
          this.$emit("done");
          EventBus.$emit("album-db-changed");
          this.model = {
            name: "",
            coverIndex: 0,
            photos: []
          };
        }
      }
    },
    async update() {
      console.log("Update");
      this.$refs.form.validate();

      if (this.valid) {
        var response = await Api.updateAlbum(this.model, this.was).catch(
          err => {
            if (err.status === 400) {
              console.log(err);
            }
          }
        );
        if (response.status === 200) {
          this.$emit("uploaded");
          this.$emit("done");
          EventBus.$emit("album-db-changed");
          this.model = {
            name: "",
            coverIndex: 0,
            photos: []
          };
        }
      }
    },
    async remove() {
      var response = await Api.removeAlbum(this.was).catch(err =>
        console.log(err)
      );
      if (response.status === 200) {
        this.$emit("done");
        EventBus.$emit("album-db-changed");
      }
      //   this.$refs.form.validate();
      //   if (this.valid) {
      //     var response = await Api.uploadAlbum(this.model, this.$axios).catch(
      //       err => {
      //         if (err.status === 400) {
      //         }
      //       }
      //     );
      //     if (response.status === 200) this.$emit("uploaded");
      //   }
    }
  }
};
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}

.remove_btn {
  position: absolute;
  top: 0;
  right: 0;

  background-color: #ff6b51;
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
  background-color: #00bfff7e;

  * {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    text-align: center;
  }
}
</style>
