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
  padding: 16px;
}
</style>
