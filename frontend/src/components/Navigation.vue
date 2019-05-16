<template lang="pug">
  mixin space
    span.space

  #nav
    router-link(to="/") Home
    +space
    router-link(to="/gallery") Gallery
    +space
    router-link(to="/about") Contacts  
</template>

<style lang="scss">


.space {
  padding: 32px;
}

#nav {
  padding: 24px;

  a {
    font-weight: bold;
    color: black;
    transition: 0.3s;

    &:hover {
      color: lightgray;
      transition: 0.3s;
    }

    &.router-link-exact-active {
      color: white;
      margin: 0px 10px;
    }
  }
}
</style>
