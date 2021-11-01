<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
    <div class="container-fluid">
      <div class="dashboard-margin justify-content-start">
        <router-link to="/login" class="navbar-brand">Smart Notes</router-link>
      </div>

      <ul class="navbar-nav mb-2 mb-md-0 justify-content-end">
        <li class="nav-item">
          <button
            class="btn btn-outline-light m-2 my-2 my-sm-0"
            v-if="!auth_status"
            @click="login"
            :disabled="disableLoginButton"
          >
            Login
          </button>
        </li>
        <li class="nav-item">
          <button
            class="btn btn-outline-light m-2 my-2 my-sm-0"
            v-if="!auth_status"
            @click="register"
            :disabled="disbableRegisterButton"
          >
            Register
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Nav",
  computed: {
    auth_status() {
      return this.$store.getters.getAuthStatus;
    },
    disableLoginButton() {
      return this.$route.name === "login";
    },
    disbableRegisterButton() {
      return this.$route.name === "register";
    },
  },
  methods: {
    login() {
      this.$router.push("/login");
    },
    register() {
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped>
.dashboard-margin {
  margin-left: 8px;
}
</style>
