<template>
  <section class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-lg-4">
        <div class="register-panel bg-white">
          <h1 class="display-3 fw-bold">Register</h1>
          <p class="fw-bold">
            To stay connected with our portal, please enter your credentials!
          </p>
          <div
            class="alert alert-danger alert-dismissable"
            role="alert"
            v-if="isInvalidPasswords"
          >
            Passwords Do Not Match!
          </div>
          <div
            class="alert alert-danger"
            role="alert"
            v-else-if="isInvalidEmail"
          >
            Invalid Email Address!
          </div>
          <div
            class="alert alert-danger"
            role="alert"
            v-else-if="isInvalidFields"
          >
            Input Fields Cannot Be Empty!
          </div>
          <div class="alert alert-danger" role="alert" v-else-if="isInvalid">
            {{ error }}
          </div>
          <br />

          <form>
            <div class="form-group">
              <label class="input-label">Name</label>
              <input
                type="text"
                v-model="name"
                class="form-control"
                placeholder="Name"
              />
            </div>
            <div class="form-group">
              <label class="input-label">Email</label>
              <input
                type="email"
                v-model="email"
                class="form-control"
                placeholder="Email"
              />
            </div>
            <div class="form-group">
              <label class="input-label">Username</label>
              <input
                type="text"
                v-model="username"
                class="form-control"
                placeholder="Username"
              />
            </div>
            <div class="form-group">
              <label class="input-label">Password</label>
              <input
                v-model="password"
                type="password"
                class="form-control"
                placeholder="Password"
              />
            </div>
            <div class="form-group">
              <label class="input-label">Confirm Password</label>
              <input
                v-model="confirmPassword"
                type="password"
                class="form-control"
                placeholder="Confirm Password"
              />
            </div>
            <br />
            <div class="form-group d-flex justify-content-center">
              <button
                class="btn btn-primary w-100"
                v-if="!isRegistering"
                id="register"
                @click.prevent="register"
              >
                Register
              </button>
              <button
                class="btn btn-primary w-100"
                v-if="isRegistering"
                disabled
                @click.prevent="register"
              >
                <LoadingComponent width="30"></LoadingComponent>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Register",
  components: {
    LoadingComponent: () => import("../components/LoadingComponent.vue"),
  },
  data() {
    return {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      error: "",
      isRegistering: false,
      isInvalid: false,
      isInvalidPasswords: false,
      isInvalidFields: false,
      isInvalidEmail: false,
    };
  },
  watch: {
    isInvalid(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.isInvalid = !this.isInvalid;
        }, 5000);
      }
    },
  },
  methods: {
    async register() {
      if (this.validateFields()) {
        this.isInvalidFields = true;
        return;
      } else if (!this.validatePasswords()) {
        this.isInvalidPasswords = true;
        return;
      } else if (!this.validateEmail()) {
        this.isInvalidEmail = true;
        return;
      }
      this.isRegistering = true;
      let registerInformation = {};

      registerInformation = {
        name: this.name,
        email: this.email,
        username: this.username,
        password: this.password,
        role: "user",
      };

      const response = await this.$store.dispatch(
        "register",
        registerInformation
      );
      this.isRegistering = false;
      if (
        response &&
        response.data.meta &&
        response.data.meta.status_code == 400
      ) {
        this.isInvalid = true;
        const { error, message } = response.data.meta;
        this.error = error + ": " + message + "!";
        return;
      }
      this.$router.push({ name: "login" });
    },
    validatePasswords: function () {
      return this.password == this.confirmPassword;
    },
    validateEmail: function () {
      //eslint-disable-next-line
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email);
    },
    validateFields: function () {
      return (
        !this.name.length ||
        !this.email.length ||
        !this.username.length ||
        !this.password.length ||
        !this.confirmPassword.length
      );
    },
  },
};
</script>

<style lang="scss">
.widget {
  margin: 0;
  height: unset;
}
.register-panel {
  position: relative;
  margin-bottom: 50px;
}
</style>
