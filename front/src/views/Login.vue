<template lang="pug">
    .test
        h1 Login
        form
            input(name="username" v-model="username" placeholder="username" required autofocus)
            br
            input(name="password" v-model="password" placeholder="password" type="password" required)
            br
            button(@click.prevent="login") Sign in
</template>


<script>
const axios = require("axios");

export default {
  data() {
    return {
      username: "",
      password: "",
      data: {}
    };
  },
  methods: {
    async login() {
      this.data = await axios.default.post("/api/admin", {
        username: this.username,
        password: this.password
      });
      this.data = this.data.data;
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  color: black;
}
input {
  background-color: darkgrey;
}
</style>
