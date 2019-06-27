<template lang="pug">
  div(:class="classData")
    slot
</template>

<script>
const api = require("@/api/settings_api");
const style = require('@/api/style').default;
import { Bus } from "../event-bus";

console.log(style)
export default {
  props: {
    'viewId': String
  },
  data() {
    return {
      theme: {
        background: undefined,
      },
      classData: [],
    }
  },
  mounted(){
    Bus.$on('settings-update', this.getThemeData);
  },
  beforeDestroy(){
    Bus.$off('settings-update', this.getThemeData);
  },
  watch: {
    viewId: function(val, oldVal) {
      this.getThemeData();
    }
  },
  methods: {
    async getThemeData(){
      this.classData = [];
      for (const element of style) {
        let response = await api.getValue(this.viewId + '_' + element.id);
        if(response === true){
          this.classData.push(element.id);
        }
      }
    },
    async getData(){
      this.theme = api.getValue(this.viewId + '_theme');
    }
  }
}
</script>
