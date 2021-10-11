import Vue from "vue";
import VueRouter from "vue-router";
const Login = () =>
  import(/* webpackChunkName: "login" */ "../views/Login.vue");
const Register = () =>
  import(/* webpackChunkName: "register" */ "../views/Register.vue");
const About = () =>
  import(/* webpackChunkName: "about" */ "../views/About.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
