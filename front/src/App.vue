<template lang="pug">
  #app
    header
      navigation
      
    router-view.view 
    
    footer
      navigation
</template>

<script>
import Navigation from "@/components/Navigation.vue";

export default {
  mounted() {
    this.$store.dispatch("init");
  },
  components: {
    Navigation
  }
};
</script>


<style lang="scss">
$firstbreak: 800px;

$footerHeight: 64px;
.view {
  margin: 32px;
  margin-bottom: 100px;
}

body,
html {
  padding: 0;
  margin: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
}

@media screen and (max-width: $firstbreak) {
  footer {
    display: none !important;
    transition: 1s;
    opacity: 0;
  }
}

@media screen and (min-width: $firstbreak) {
  header {
    display: none !important;
    transition: 1s;
    opacity: 0;
  }
}

footer,
header {
  height: $footerHeight;
  transition: 0.5s;
  opacity: 1;
  background-color: white;
}

footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}

#nav {
  padding: 24px;

  a {
    font-weight: bold;
    color: grey;
    transition: 0.3s;

    &:hover {
      color: lightgrey;
      transition: 0.3s;
    }

    &.router-link-exact-active {
      color: black;
    }
  }
}
</style>
