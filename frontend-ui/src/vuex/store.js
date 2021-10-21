import Vue from "vue";
import Vuex from "vuex";
import HTTP from "../http-service";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    auth_status: false,
    token: "",
    currentUser: {},
  },
  mutations: {
    SET_AUTH_STATUS: (state, auth_status) => {
      state.auth_status = auth_status;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_CURRENT_USER: (state, user) => {
      state.currentUser = user;
    },
  },
  actions: {
    setAuthStatus: ({ commit }, auth_status) => {
      commit("SET_AUTH_STATUS", auth_status);
    },
    setAuthToken: ({ commit }, token) => {
      commit("SET_TOKEN", token);
    },
    login: async ({ commit }, credentials) => {
      return await HTTP.post("user/login", credentials).then(({ data }) => {
        const token = data.meta.token;
        const currentUser = data.currentUser;
        const message = data.meta.message;
        if (!message) {
          commit("SET_TOKEN", token);
          commit("SET_CURRENT_USER", currentUser);
          commit("SET_AUTH_STATUS", true);
        }
      });
    },
    register: async (context, information) => {
      return await HTTP.post("user/register", information);
    },
    logout: ({ commit }) => {
      commit("SET_TOKEN", "");
      commit("SET_CURRENT_USER", {});
      commit("SET_AUTH_STATUS", false);
    },
  },
  getters: {
    getAuthStatus(state) {
      return state.auth_status;
    },
    getToken(state) {
      return state.token;
    },
  },
});

export default store;
