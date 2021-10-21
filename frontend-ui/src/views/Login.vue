<template>
  <section class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-lg-4">
        <div class="login-panel bg-white text-left">
          <h1 class="display-3 fw-bold">Login</h1>
          <p class="fw-bold">Welcome back</p>
          <br />
          <form action="">
            <div class="form-group">
              <div class="alert alert-danger" role="alert" v-if="isValid">
                Invalid Login Credentials!
              </div>
              <label class="input-label">Email / Username</label>
              <input
                type="email"
                v-model="emailOrUsername"
                class="form-control"
                placeholder="eg. john_doe@gmail.com / johndoe"
              />
            </div>
            <div class="form-group">
              <label class="input-label">Password</label>
              <input
                type="password"
                v-model="password"
                class="form-control"
                placeholder="Must have at least 6 characters"
              />
            </div>
            <br />
            <div class="form-group d-flex justify-content-center">
              <button
                class="btn btn-primary w-100"
                id="login"
                @click.prevent="login"
                v-if="!isLoggingIn"
              >
                Login
              </button>
              <button
                class="btn btn-primary w-100"
                disabled
                @click.prevent="login"
                v-if="isLoggingIn"
              >
                <LoadingComponent width="30"></LoadingComponent>
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
export default {
  name: "Login",
  components: {
    LoadingComponent: () => import("../components/LoadingComponent.vue"),
  },
  data() {
    return {
      emailOrUsername: "",
      password: "",
      isLoggingIn: false,
      isAlertShow: false,
      isValid: false,
    };
  },
  watch: {
    isValid(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.isValid = !this.isValid;
        }, 5000);
      }
    },
  },
  methods: {
    async login() {
      if (this.validateEmptyFields()) {
        this.isValid = true;
        return;
      }
      this.isLoggingIn = true;
      let loginCredentials = {};
      if (
        //eslint-disable-next-line
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
          this.emailOrUsername
        )
      ) {
        loginCredentials = {
          email: this.emailOrUsername,
          password: this.password,
        };
      } else {
        loginCredentials = {
          username: this.emailOrUsername,
          password: this.password,
        };
      }
      await this.$store.dispatch("login", loginCredentials);
      const token = this.$store.getters.getToken;
      if (token != "") {
        this.isAlertShow = true;
        this.$router.push({ name: "dashboard" });
      } else {
        this.isAlertShow = false;
        this.isLoggingIn = false;
        this.isValid = true;
      }
    },
    validateEmptyFields: function () {
      return !this.emailOrUsername.length || !this.password.length;
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
  padding: 50px 0;
}
.register-link {
  margin-top: 20px;
}
</style>
