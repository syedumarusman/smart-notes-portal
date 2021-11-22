import Vue from "vue";
import Vuex from "vuex";
import { HTTP, HTTP_Flask } from "../http-service";
import createPersistedState from "vuex-persistedstate";

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
      return HTTP.post("user/register", information);
    },
    verifyToken: async ({ state, dispatch }) => {
      return HTTP.get("/checkAuthToken", {
        params: { token: state.token },
      }).then(({ data }) => {
        if (data && data.tokenExpired) {
          dispatch("logout");
        }
      });
    },
    refreshToken: async (context, currentUser) => {
      return HTTP.post("/refreshToken", currentUser);
    },
    generateManuscript: async (context, file) => {
      let formData = new FormData();
      formData.append("file", file);
      return HTTP_Flask.post("/transcribe/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    getManuscriptList: ({ getters }) => {
      return HTTP.get(`user/${getters.getCurrentUser.userId}`);
    },
    addAudioFile: async ({ getters }, payload) => {
      return HTTP.patch(
        `user/${getters.getCurrentUser.userId}/addAudioDetails`,
        payload
      );
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
    getCurrentUser(state) {
      return state.currentUser;
    },
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
});

export default store;
