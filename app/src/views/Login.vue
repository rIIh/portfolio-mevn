<template lang="pug">
    v-layout(fill-height align-center justify-center)
      v-flex(shrink)
        form.form-container(v-if="!isAuth" @submit.prevent="login")
          v-layout.login-form(align-center justify-center column fill-height)
            .main-text Login
            input(name="username" v-model="username" placeholder="username" required autofocus)
            input(name="password" v-model="password" placeholder="password" type="password" required)
            r-btn(@click="login") Sign in
        template(v-else)
          .main-text Already authenticated
          r-btn( @click="logout") Log out
</template>
<style lang="scss">
.form-container {
  // height: 200px;
  // width: 200px;
  input {
    display: block !important;
    border: 1px solid black;
    margin: 8px;
    padding: 4px;
  }
  * {
    width: 100%;
    height: 32px;
  }
  &:focus {
    outline: 0;
  }
}
</style>

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
    login() {
      const { username, password } = this;
      this.$store.dispatch(C.AUTH_REQUEST, { username, password }).then(() => {
        this.$router.push("/");
      });
    },

    async logout() {
      await this.$store.dispatch(C.AUTH_LOGOUT);
      this.$forceUpdate();
    }
  }
};
</script>


