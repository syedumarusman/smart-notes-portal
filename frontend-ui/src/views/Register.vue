<template>
  <section class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-lg-4">
        <div class="login-panel bg-white">
          <h1 class="display-3 fw-bold">Register</h1>
          <p class="fw-bold">
            To stay connected with our portal, please enter your credentials!
          </p>
          <br />
          <div class="alert alert-success" role="alert" v-if="isAlertShow">
              Registered Successfully. waiting for redirect.
              <LoadingComponent width="10"></LoadingComponent>
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
                v-if="!isLoading"
                id="login"
                @click.prevent="login"
              >
                Submit
              </button>
              <button
                class="btn btn-primary w-100"
                v-if="isLoading"
                disabled
                @click.prevent="login"
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
      isLoading: false,
    };
  },
};
</script>

<style></style>
