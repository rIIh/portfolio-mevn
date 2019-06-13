<template lang="pug">
    button.custom-btn(:class="(pressed ? 'pressed ' : '') + theme" @click="$emit('click')")
        span(v-show="!loading")
            slot()
        v-progress-linear.progress.ma-0(v-if="loading" :indeterminate="!!progress" :value="progress")
</template>


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
    progress: Number,
    pressed: Boolean,
    classes: ""
  }
};
</script>

<style lang="scss" scoped>
.custom-btn {
  border: 1px solid black;
  position: relative;
  color: black;
  margin: 6px;
  min-height: 32px;
  min-width: 32px;
  padding: 0.5ex 2em;
  vertical-align: super !important;
  transition: 0.2s;

  .progress {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 50%;
    transform: translate(-50%, -50%);
  }

  &.theme--dark {
    border: 1px solid white;
    color: white;
    * {
      color: white !important;
    }

    &.pressed,
    &:hover:enabled {
      border: 1px solid white;
      background: white;
      color: black !important;
      * {
        color: black !important;
      }
    }
    &:disabled {
      color: lightgrey;
      border: 1px solid lightgrey;
      * {
        color: lightgrey;
      }
    }
    &:hover:disabled {
      border: 1px solid lightgrey;
      background: lightgrey;
      color: black;
      * {
        color: black;
      }
    }
    &:focus {
      outline: 0;
    }
  }

  &.pressed,
  &:hover:enabled {
    border: 1px solid black;
    background: black;
    color: white;
    * {
      color: white;
    }
  }
  &:disabled {
    color: grey;
    border: 1px solid grey;
    * {
      color: grey;
    }
  }
  &:hover:disabled {
    border: 1px solid grey;
    background: grey;
    color: white;
    * {
      color: white;
    }
  }
  &:focus {
    outline: 0;
  }
}
</style>
