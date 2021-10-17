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
            class="alert-message alert-danger alert-dismissable"
            role="alert"
            v-if="isInvalidPasswords"
          >
            Passwords Do Not Match!
          </div>
          <div
            class="alert-message alert-danger"
            role="alert"
            v-else-if="isInvalidEmail"
          >
            Invalid Email Address!
          </div>
          <div
            class="alert-message alert-danger"
            role="alert"
            v-else-if="isInvalidFields"
          >
            Error, Fields Cannot Be Empty!
          </div>
          <div
            class="alert-message alert-danger"
            role="alert"
            v-else-if="isInvalid"
          >
            Error, Email / Username has already been taken.
          </div>
          <br />
          <div class="alert alert-success" role="alert" v-if="isAlertShow">
              Registered Successfully. waiting for redirect.
              <LoadingComponent width="30"></LoadingComponent>
          </div>
  
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
      isAlertShow: false,
      isRegistering: false,
      isInvalid: false,
      isInvalidPasswords: false,
      isInvalidFields: false,
      isInvalidEmail: false,
    };
  },
  methods: {
    async register() {
      if (this.validateFields()) {
        this.isInvalidFields = true;
        return;
      }
      else if (!this.validatePasswords()){
        this.isInvalidPasswords = true;
        return;
      }
      else if (!this.validateEmail()){
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

      // Not implemented completely, was trying to figure out
      // how to check if registration failed out here rather than in store.
      try{
        await this.$store.dispatch("register", registerInformation);
        this.isAlertShow = true;
        this.$router.push({ name: "login" })
      }
      catch(err){
        console.log("Error:", err)
        this.isRegistering = false;
        this.isAlertShow = false;
        this.isInvalid = true;
      }
    },
    validatePasswords: function () {
      return (this.password == this.confirmPassword);
    },
    validateEmail: function () {
      //eslint-disable-next-line
      return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email))
    },
    validateFields: function () {
      return !this.name.length || 
             !this.email.length ||
             !this.username.length ||
             !this.password.length ||
             !this.confirmPassword.length;
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
  .alert {
    opacity: 0;
    width: 100%;
    margin: 0;
    top: 10px;
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
</style>
