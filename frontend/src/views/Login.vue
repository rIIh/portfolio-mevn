<template lang="pug">
    .test
        h1 Login
        form(v-if="!isAuth")
            input(name="username" v-model="username" placeholder="username" required autofocus)
            br
            input(name="password" v-model="password" placeholder="password" type="password" required)
            br
            button(@click.prevent="login") Sign in
        template(v-else)
          h1 Already authenticated
          v-btn(round dark primary @click="logout") Log out
</template>


<script>
const C = require("../api/consts");
export default {
  data() {
    return {
      username: "",
      password: "",
      data: {}
    };
  },
  computed: {
    isAuth() {
      return this.$store.getters.isAuthenticated;
    }
  },
  methods: {
    // async login() {
    //   this.res = await this.$axios.post("/api/admin/auth", {
    //     username: this.username,
    //     password: this.password
    //   });
    //   this.data = this.res.data;
    // },
    login() {
      const { username, password } = this;
      this.$store.dispatch(C.AUTH_REQUEST, { username, password }).then(() => {
        this.$router.push("/");
      });
    },

    logout() {
      this.$store.dispatch(C.AUTH_LOGOUT);
    }
    // login() {
    //   C.myLoginRoutine(
    //     {
    //       username: this.username,
    //       password: this.password
    //     },
    //     this.$axios
    //   ).then(() => {
    //     this.$router.push("/");
    //   });
    // }
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
