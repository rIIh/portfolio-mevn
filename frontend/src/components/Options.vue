<template lang="pug">
.card(style="background: white")
  .v-card__title
    .container.grid-list-md.pb-0()
      .layout.justify-start
        span.headline
          span {{ title }}
  .v-card__text
    .container.grid-list-md.pt-0()
      template(v-for="(field, index) in fields")
        .layout.row.align-center.justify-space-between
          .flex.shrink
            span {{field.label}}
          .flex.shrink
            v-switch.mt-0(v-if="field.type === 'boolean'" v-model="field.value" hide-details color="black" :disabled="busyVal" @change="(val) => updateValue(val, field)")
      //- img.opt_img(v-if="type === 'image' && value !== 'none'" :src="file ? value.path : assetsPath + value.path" alt="background image")
      //- v-text-field(v-if="type === 'string'")
      //- input(v-if="type === 'file' || type === 'image'" type="file" v-show="type === 'file'" ref="file_picker" :accept="type === 'image' ? 'image/*' : ''" @change="onFilePicked")
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
import { Bus } from '../event-bus';

export default {
  data() {
    return {
      values: [],
      busyVal: false
    };
  },
  computed: {
    assetsPath() {
      let path = process.env.VUE_APP_ASSETS_PATH;
      return path === undefined ? "" : path;
    },
  },
  props: {
    id: String,
    title: String,
    fields: Array,
    // fields: Array,
    // names: Array,
    // types: Array,
  },
  activated(){
    this.reload();
  },
  mounted(){
    this.reload();
  },
  methods: {
    async reload(){
      console.log('reload')
      for (let field of this.fields){
        let response = await api.getValue(this.id + '_' + field.id)
        field.value = response !== 'none' ? response : false
      }
      this.$forceUpdate();
    },
    async updateValue(value, field){
      this.busy(true);
      console.log(value)
      let response = await api.setValue(this.id + '_' + field.id, {value});
      if(response.status === 200) {
        Bus.$emit('settings-update');
        console.log(response)
      }
      this.busy(false);
    },
    busy(value) {
      this.busyVal = value;
      this.$emit(value ? "busy" : "unbusy");
    },
  }
};
</script>

