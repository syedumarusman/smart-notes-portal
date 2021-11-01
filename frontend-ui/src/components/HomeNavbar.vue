<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
    <div class="container-fluid">
      <div class="title-position justify-content-start">
        <router-link to="/" class="navbar-brand">Smart Notes</router-link>
      </div>

      <ul class="navbar-nav mb-2 mb-md-0 justify-content-end">
        <li class="nav-item">
          <button
            class="btn btn-outline-danger m-2 my-2 my-sm-0"
            v-if="auth_status"
            @click="logout"
          >
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
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.title-position {
  margin-left: 8px;
}
</style>
