import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    auth_status: false,
    token: "",
  },
  mutations: {
    SET_AUTH_STATUS: (state, auth_status) => {
      state.auth_status = auth_status;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
  },
  actions: {
    setAuthStatus: (commit, auth_status) => {
      commit("SET_AUTH_STATUS", auth_status);
    },
    setAuthToken: (commit, token) => {
      commit("SET_TOKEN", token);
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
