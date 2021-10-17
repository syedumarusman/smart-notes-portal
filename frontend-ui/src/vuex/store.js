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
      await HTTP.post("user/login", credentials)
        .then(({ data }) => {
          console.log("Data:", data);
          const token = data.meta.token;
          const currentUser = data.currentUser;
          const message = data.meta.message;
          if(!message){
            commit("SET_TOKEN", token);
            commit("SET_CURRENT_USER", currentUser);
            commit("SET_AUTH_STATUS", true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    register: async ({ commit }, information) => {
      commit("SET_AUTH_STATUS", false); //Just to call commit to prevent err
      await HTTP.post("user/register", information)
        .then(({ data }) => {
          console.log("Data:", data);
          const message = data.meta.message;
          console.log("Message: ", message)
          if (!message){
            console.log("Register Successful!")
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
