<template lang="pug">
  mixin space
    span.space

  transition-group(id="nav" tag="div" name="slide-fade")
    router-link(to="/" key="home" v-if="currentRoute != 'home'") Home
    router-link(to="/gallery" key="gallery" v-if="currentRoute != 'home'") Gallery
    router-link(to="/about"  key="contacts") Contacts  
</template>
<style lang="scss">
.space {
  padding: 32px;
}

/* Анимации появления и исчезновения могут иметь */
/* различные продолжительности и динамику.       */
.slide-fade-enter-active {
  transition: all 1.3s ease;
}
.slide-fade-leave-active {
  transition: all 1.8s cubic-bezier(1, 0.1, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active до версии 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
  padding: 0;
}

#nav {
  padding: 24px;

  a {
    font-weight: bold;
    color: black;
    transition: 0.3s;
    padding: 0px 8px;

    &:hover {
      color: lightgray;
      transition: 0.3s;
    }

    &.router-link-exact-active {
      color: white;
      padding: 0px 16px;
      margin: 0px 10px;
    }
  }
}
</style>

<script>
export default {
  computed: {
    currentRoute() {
      return this.$route.name;
    }
  }
};
</script>

