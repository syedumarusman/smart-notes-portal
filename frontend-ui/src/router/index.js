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
        component: Dashboard,
      },
      {
        path: "/manuscript",
        component: Manuscript,
      },
      {
        path: "/summary",
        component: Summary,
      },
      {
        path: "/feedback",
        component: Feedback,
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
