<template lang="pug">
  #home
    router-link(to="gallery" class="link") 
      h1 Yura Taralov
</template>

<style lang="scss">
#home {
  align-content: center;
  a {
    text-decoration: none;
  }
  h1 {
    padding-top: 35vh;
    color: white;
  }
}

#nav {
  padding: 24px;

  a {
    font-weight: bold;
    color: gray;
    transition: 0.3s;

    &:hover {
      color: lightgrey;
      transition: 0.3s;
    }

    &.router-link-exact-active {
      color: black;
      margin: 0px 10px;
    }
  }
}
</style>
