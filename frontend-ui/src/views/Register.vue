<template>
  <section class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-lg-4">
        <div class="login-panel bg-white">
          <div
            class="alert alert-primary"
            role="alert"
            :style="{ opacity: isAlertShow ? 1 : 0 }"
          >
            Registered successfully. <small>waiting for redirect.</small>
            <loading-component width="30"></loading-component>
          </div>
          <h1 class="display-3 fw-bold">Register</h1>
          <p class="fw-bold">
            To stay connected with portal please enter your credentials.
          </p>
          <br />
          <form action="">
            <div class="form-group">
              <lable class="input-label">Name</lable>
              <input
                type="text"
                v-model="name"
                class="form-control"
                placeholder="Name"
              />
            </div>
            <div class="form-group">
              <lable class="input-label">Email</lable>
              <input
                type="email"
                v-model="email"
                class="form-control"
                placeholder="Email"
              />
            </div>
            <div class="form-group">
              <lable class="input-label">Password</lable>
              <input
                v-model="password"
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
                <loader-component width="30"></loader-component>
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
  data() {
    return {
      name: "",
      email: "",
      password: "",
    };
  },
};
</script>

<style></style>
