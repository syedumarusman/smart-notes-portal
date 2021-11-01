import Vue from "vue";
import VueRouter from "vue-router";
import Store from "../vuex/store.js";
const Login = () =>
  import(/* webpackChunkName: "login" */ "../views/Login.vue");
const Register = () =>
  import(/* webpackChunkName: "register" */ "../views/Register.vue");
const Dashboard = () =>
  import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue");
const Home = () => import(/* webpackChunkName: "home" */ "../views/Home.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/",
    redirect: "/dashboard",
    component: Home,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/dashboard",
        component: Dashboard,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    if (Store.state.auth_status) {
      next();
    } else {
      next({ name: "login" });
    }
  }
  next();
});

export default router;
