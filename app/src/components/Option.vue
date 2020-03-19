<template lang="pug">
.card(style="background: white")
    .v-card__title
        .container.grid-list-md.pb-0()
            .layout.justify-start
                span.headline
                    slot
    .v-card__text
        .container.grid-list-md.pt-0()
            img.opt_img(v-if="type === 'image' && value !== 'none'" :src="file ? value.path : assetsPath + value.path" alt="background image")
            //- v-text-field(v-if="type === 'string'")
            input(v-if="type === 'file' || type === 'image'" type="file" v-show="type === 'file'" ref="file_picker" :accept="type === 'image' ? 'image/*' : ''" @change="onFilePicked")
            .layout.justify-space-between.fluid.pt-4
                    .flex.shrink(v-if="initial !== 'none'")
                        r-btn.ma-0(ignoreTheme @click="clear" ) Remove
                    .spacer(v-else)
                    .flex.shrink(v-if="type=== 'image'")
                        r-btn.ma-0(ignoreTheme @click="pickFile") Select image
                    .spacer(v-else)
                    .flex.shrink
                        r-btn.ma-0(ignoreTheme @click="setValue" :loading="busyVal" :disabled="waitForData") Set

            
</template>
<style lang="scss">
.opt_img {
  max-height: 350px;
  max-width: 100%;
}
</style>

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
    },
    waitForData() {
      return (this.value.hash !== undefined || this.value === 'none') || this.busyVal;
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
  mounted() {
    this.refresh();
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
      if (this.waitForData) return;
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
      this.$emit("submit");
      this.refresh();
    },
    async clear() {
      this.busy(true);
      var response = await api.removeValue(this.property).catch(err => {
        this.busy(false);
      });
      if (response.status === 200) {
        this.$emit("submit");
        console.log(response)
      }
      this.busy(false);
      this.refresh();
    }
  }
};
</script>

