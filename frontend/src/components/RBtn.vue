<template lang="pug">
    button.custom-btn(:class="(pressed ? 'pressed ' : ' ') + (ignoreTheme ? '' : theme + ' ') + (disabled ? 'disabled' : ' ')" @click="$emit('click')")
        span(:class="loading ? 'invisible' : ''")
            slot(v-show="!loading")
        v-progress-linear.progress.ma-0(v-if="loading" :indeterminate="!!progress" color="black" :value="progress")
</template>

<style lang="scss" scoped>
.invisible {
  opacity: 0;
  transition: 0.2s;
  * {
    opacity: 0;
  }
}
</style>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    theme() {
      return this.$store.getters.theme;
    }
  },
  props: {
    loading: Boolean,
    ignoreTheme: Boolean,
    progress: Number,
    pressed: Boolean,
    disabled: Boolean,
    classes: ""
  }
};
</script>


