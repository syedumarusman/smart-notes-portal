<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
    <div class="container-fluid">
      <div class="dashboard-margin justify-content-start">
        <router-link to="/" v-if="auth_status" class="navbar-brand"
          >Dashboard</router-link
        >
      </div>

      <ul class="navbar-nav mb-2 mb-md-0 justify-content-end">
        <li class="nav-item">
          <button class="btn btn-outline-light m-2 my-2 my-sm-0" v-if="!auth_status" @click="login">
            Login
          </button>
        </li>
        <li class="nav-item">
          <button class="btn btn-outline-light m-2 my-2 my-sm-0" v-if="!auth_status" @click="register">
            Register
          </button>
        </li>
        <li class="nav-item">
          <button class="btn btn-outline-danger m-2 my-2 my-sm-0" v-if="auth_status" @click="logout">
            Logout
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
  },
  methods: {
    login() {
      this.$router.push('/')
    },
    register () {
      this.$router.push('/register')
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/")
    },
  },
};
</script>

<style scoped>
.dashboard-margin {
  margin-left: 8px;
}
</style>
