<template>
  <div id="app">
    <Navbar v-if="!auth_status" />
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  components: {
    Navbar: () => import("./components/Navbar.vue"),
  },
  computed: {
    auth_status() {
      return this.$store.getters.getAuthStatus;
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  margin: 0;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
