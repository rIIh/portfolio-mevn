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
$firstbreak: 1024px;

$footerHeight: 125px;

h1 {
  font-family: "Space Mono";
}
a {
  font-family: "Space Mono";
}

.view {
  padding: 32px;
  padding-bottom: 100px;
  width: 100%;
  height: 100%;
}

body,
html,
#app {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
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
}

footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
