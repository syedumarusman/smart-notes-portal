<template>
  <section class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-lg-4">
        <div class="login-panel bg-white text-left">
          <div
            class="alert alert-primary"
            role="alert"
            :style="{ opacity: isAlertShow ? 1 : 0 }"
          >
            Login successfully. <small>waiting for redirect.</small>
            <loading-component width="30"></loading-component>
          </div>
          <h1 class="display-3 fw-bold">Login</h1>
          <p class="fw-bold">Welcome back</p>
          <br />
          <form action="">
            <div class="form-group">
              <lable class="input-label">Email</lable>
              <input type="email" class="form-control" placeholder="Email" />
            </div>
            <div class="form-group">
              <lable class="input-label">Password</lable>
              <input
                type="password"
                class="form-control"
                placeholder="Password"
              />
            </div>
            <br />
            <div class="form-group d-flex justify-content-center">
              <button
                class="btn btn-primary w-25"
                id="login"
                @click.prevent="login"
                v-if="!isLoggingIn"
              >
                Login
              </button>
              <button
                class="btn btn-primary w-25"
                disabled
                @click.prevent="login"
                v-if="isLoggingIn"
              >
                <loading-component width="30"></loading-component>
              </button>
            </div>
          </form>
          <div class="register-link">
            <p>
              Don't have an account?
              <router-link to="/register" class="navbar-brand">
                <b>Register Now!</b>
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import LoadingComponent from "../components/LoadingComponent.vue";

export default {
  components: { LoadingComponent },
  data() {
    return {
      isLoggingIn: false,
      isAlertShow: false,
    };
  },
  methods: {
    login() {
      this.isLoggingIn = true;
      this.redirect();
    },
    redirect() {
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style lang="scss">
.widget {
  margin: 0;
  height: unset;
}
.login-panel {
  position: relative;
  padding: 200px 0;
  .alert {
    opacity: 0;
    position: absolute;
    width: 100%;
    top: 100px;
    transition: all 0.5s;
    &.alert-primary {
      background-color: #007bff;
      color: #fff;
      font-size: 18px;
      border: none;
    }
    .widget {
      position: absolute;
      right: 5px;
      top: 0;
      margin: 10px;
    }
  }
}
.register-link {
  margin-top: 20px;
}
</style>
