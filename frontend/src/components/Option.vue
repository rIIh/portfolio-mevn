<template lang="pug">
v-card
    v-card-title
        v-container.pb-0(grid-list-md)
            v-layout(justify-start)
                span.headline
                    slot
    v-card-text
        v-container.pt-0(grid-list-md)
            img.opt_img(v-if="type === 'image' && value !== 'none'" :src="file ? value.path : assetsPath + value.path" alt="background image")
            //- v-text-field(v-if="type === 'string'")
            input(v-if="type === 'file' || type === 'image'" type="file" v-show="type === 'file'" ref="file_picker" :accept="type === 'image' ? 'image/*' : ''" @change="onFilePicked")
            v-layout.pt-4(:justify-space-between="true" fluid)
                    v-flex(shrink)
                        r-btn.ma-0(@click.prevent="clear") Remove
                    v-flex(shrink v-if="type=== 'image'")
                        r-btn.ma-0(@click="pickFile") Select image
                    v-spacer(v-else)
                    v-flex(shrink)
                        r-btn.ma-0(@click="setValue()" :loading="busyVal" :disabled="initial === value || busyVal") Set

            
</template>

<script>
const C = require("../api/consts");
const api = require("../api/settings_api");
const luminosity = require("../scripts/luminosity");
import { EventBus } from "@/event-bus.js";

export default {
  data() {
    return {
      initial: {},
      value: {},
      file: false,
      busyVal: false
    };
  },
  computed: {
    assetsPath() {
      let path = process.env.VUE_APP_ASSETS_PATH;
      return path === undefined ? "" : path;
    }
  },
  props: {
    opened: Boolean,
    property: String,
    type: String
  },
  watch: {
    opened: function(newVal, old) {
      if (newVal) {
        this.refresh();
      }
    }
  },
  methods: {
    busy(value) {
      this.busyVal = value;
      this.$emit(value ? "busy" : "unbusy");
    },
    async refresh() {
      this.value = await api.getValue(this.property);
      this.initial = JSON.parse(JSON.stringify(this.value));
      this.file = false;
    },
    pickFile() {
      this.$refs.file_picker.click();
    },
    onFilePicked(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        let value = {};
        value.path = reader.result;
        value.file = file;
        this.value = value;
        this.file = true;
      });
    },
    async setValue() {
      this.busy(true);
      var response = {};
      switch (this.type) {
        case "image":
          let image_data = {
            luminosity: await luminosity.check(this.value.path, {
              sWidth: 1,
              sHeight: 0.15
            })
          };
        case "file":
          response = await api.setValueWithFile(
            this.property,
            this.type,
            this.value.file,
            image_data
          );
          break;
        default:
          response = await api.setValue(this.property, this.value).catch(e => {
            this.busy(false);
          });
          break;
      }
      this.busy(false);
      this.$emit("done");
      this.refresh();
    },
    async clear() {
      this.busy(true);
      var response = await api.removeValue(this.property).catch(err => {
        this.busy(false);
        console.log(err);
      });
      if (response.status === 200) {
        this.$emit("done");
      }
      this.busy(false);
      this.refresh();
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
.opt_img {
  max-height: 350px;
  max-width: 100%;
}
</style>
