import Vue from "vue";
import VueRouter from "vue-router";
import Store from "../vuex/store.js";
const Login = () =>
  import(/* webpackChunkName: "login" */ "../views/Login.vue");
const Register = () =>
  import(/* webpackChunkName: "register" */ "../views/Register.vue");
const Home = () => import(/* webpackChunkName: "home" */ "../views/Home.vue");
const Dashboard = () =>
  import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue");
const Manuscript = () =>
  import(/* webpackChunkName: "manuscript" */ "../views/Manuscript.vue");
const Summary = () =>
  import(/* webpackChunkName: "summary" */ "../views/Summary.vue");
const Feedback = () =>
  import(/* webpackChunkName: "feedback" */ "../views/Feedback.vue");

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
        name: "dashboard",
        component: Dashboard,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/manuscript",
        name: "manuscript",
        component: Manuscript,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/summary",
        name: "summary",
        component: Summary,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/feedback",
        name: "feedback",
        component: Feedback,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    await Store.dispatch("verifyToken");
    if (Store.state.auth_status) {
      next();
    } else {
      next({ name: "login" });
    }
  }
  next();
});

export default router;
