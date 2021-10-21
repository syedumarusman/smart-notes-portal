import Vue from "vue";
import VueRouter from "vue-router";
const Login = () =>
  import(/* webpackChunkName: "login" */ "../views/Login.vue");
const Register = () =>
  import(/* webpackChunkName: "register" */ "../views/Register.vue");
const Dashboard = () =>
  import(/* webpackChunkName: "about" */ "../views/Dashboard.vue");

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
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
