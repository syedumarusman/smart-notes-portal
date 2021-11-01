<template>
  <div>
    <HomeNavbar v-if="auth_status"></HomeNavbar>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-2 d-none d-md-block sidebar">
          <SidebarMenu></SidebarMenu>
        </div>
        <div class="col-md-9 ml-sm-auto col-lg-10 pt-3 pe-4 ps-0">
          <router-view />
        </div>
      </div>
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
.container-fluid {
    padding-right:0;
    padding-left:0;
    margin-right:auto;
    margin-left:auto
 }
</style>
