<template lang="pug">
  div(class='dark')
    slot
</template>

<script>
export default {
  props: {
    id: String
  }
}
</script>
