<template>
  <div>
    <HomeNavbar v-if="auth_status"></HomeNavbar>
    <SidebarMenu></SidebarMenu>
    <div class="main-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import HomeNavbar from "../components/HomeNavbar.vue";
import SidebarMenu from "../components/SidebarMenu.vue";
export default {
  name: "Home",
  components: { SidebarMenu, HomeNavbar },
  computed: {
    auth_status() {
      return this.$store.getters.getAuthStatus;
    },
  },
};
</script>

<style>
.main-container {
    position: absolute;
    top: 80px;
    left: 90px;
    right: 0;
    bottom: 0;
}</style>
