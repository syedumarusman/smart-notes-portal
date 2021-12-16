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
    audioText: [],
    summaryText: [],
    manuscriptFeedbacks: [],
    summaryFeedbacks: [],
    currentTab: "",
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
    SET_AUDIO_TEXT: (state, payload) => {
      const subList = [payload._id, payload.text];
      state.audioText.push(subList);
    },
    REMOVE_AUDIO_TEXT: (state, _id) => {
      state.audioText = state.audioText.filter((items) => items[0] !== _id);
    },
    SET_SUMMARY_TEXT: (state, payload) => {
      const subList = [payload._id, payload.text];
      state.summaryText.push(subList);
    },
    REMOVE_SUMMARY_TEXT: (state, _id) => {
      state.summaryText = state.summaryText.filter((items) => items[0] !== _id);
    },
    SET_MANUSCRIPT_FEEDBACKS: (state, feedback) => {
      state.manuscriptFeedbacks.push(feedback);
    },
    SET_SUMMARY_FEEDBACKS: (state, feedback) => {
      state.summaryFeedbacks.push(feedback);
    },
    SET_CURRENT_TAB: (state, currentTab) => {
      state.currentTab = currentTab;
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
          commit("SET_CURRENT_TAB", "dashboard");
        }
      });
    },
    register: async (context, information) => {
      return HTTP.post("user/register", information);
    },
    verifyToken: async ({ state, dispatch }) => {
      if (state.token.length === 0) {
        dispatch("logout");
        return;
      }
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
    generateManuscript: async (context, payload) => {
      let formData = new FormData();
      formData.append("file", payload.file);
      if (payload.speakerCount)
        formData.append("speakerCount", payload.speakerCount);
      return HTTP_Flask.post("/transcribe/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    getUserDetails: ({ getters }) => {
      return HTTP.get(`user/${getters.getCurrentUser.userId}`);
    },
    generateSummary: async (context, payload) => {
      let formData = new FormData();
      formData.append("file", payload.file);
      if (payload.sentenceCount)
        formData.append("sentenceCount", payload.sentenceCount);
      return HTTP_Flask.post("/summarize/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    addSummaryFile: async ({ commit, getters }, payload) => {
      const text = payload.text;
      delete payload.text;
      const response = await HTTP.patch(
        `user/${getters.getCurrentUser.userId}/addSummaryDetails`,
        payload
      );
      const _id = response.data.data._id;
      const data = { _id, text };
      commit("SET_SUMMARY_TEXT", data);
    },
    removeSummaryFile: async ({ getters, commit }, payload) => {
      commit("REMOVE_SUMMARY_TEXT", payload._id);
      return HTTP.patch(
        `user/${getters.getCurrentUser.userId}/removeSummaryDetails`,
        payload
      );
    },
    addAudioFile: async ({ commit, getters }, payload) => {
      const text = payload.docText;
      delete payload.docText; // Removes PDF document from payload before updating audios
      const response = await HTTP.patch(
        `user/${getters.getCurrentUser.userId}/addAudioDetails`,
        payload
      );
      const _id = response.data.data._id;
      const data = { _id, text };
      commit("SET_AUDIO_TEXT", data);
    },
    removeAudioFile: async ({ getters, commit }, payload) => {
      commit("REMOVE_AUDIO_TEXT", payload._id);
      return HTTP.patch(
        `user/${getters.getCurrentUser.userId}/removeAudioDetails`,
        payload
      );
    },
    submitFeedback: async ({ commit, getters }, payload) => {
      const response = await HTTP.patch(
        `user/${getters.getCurrentUser.userId}/addFeedback`,
        payload
      );
      if (payload.feedbackType === "manuscript") {
        commit("SET_MANUSCRIPT_FEEDBACKS", response);
      } else if (payload.feedbackType === "summary") {
        commit("SET_SUMMARY_FEEDBACKS", response);
      }
      return response;
    },
    logout: ({ commit }) => {
      commit("SET_TOKEN", "");
      commit("SET_CURRENT_USER", {});
      commit("SET_AUTH_STATUS", false);
      commit("SET_CURRENT_TAB", "dashboard");
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
    getAudioText(state) {
      return state.audioText;
    },
    getSummaryText(state) {
      return state.summaryText;
    },
    getCurrentTab(state) {
      return state.currentTab;
    },
    getAudioTextCount(state) {
      return state.audioText.length;
    },
    getSummaryTextCount(state) {
      return state.summaryText.length;
    },
    getTotalGenerations(state) {
      return state.audioText.length + state.summaryText.length;
    },
    getManuscriptFeedbacks(state) {
      return state.manuscriptFeedbacks;
    },
    getSummaryFeedbacks(state) {
      return state.summaryFeedbacks;
    },
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage,
    }),
  ],
});

export default store;
