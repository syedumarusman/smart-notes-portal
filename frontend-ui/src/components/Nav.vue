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
          <router-link to="/" v-if="!auth_status" class="nav-link"
            >Login</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/register" v-if="!auth_status" class="nav-link"
            >Register</router-link
          >
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" v-if="auth_status" @click="logout"
            >Logout</a
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    auth_status() {
      return this.$store.getters.getAuthStatus;
    },
  },
  methods: {
    async logout() {
      this.$store.dispatch("setAuthToken", "");
      this.$store.dispatch("setAuthStatus", false);
      this.router.push("/");
    },
  },
};
</script>

<style scoped>
.dashboard-margin {
  margin-left: 8px;
}
</style>
