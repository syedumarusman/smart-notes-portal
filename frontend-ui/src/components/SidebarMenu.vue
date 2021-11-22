<template>
  <div class="container-fluid">
    <div class="py-4 px-3 bg-light">
      <div class="media d-flex">
        <img
          src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
          alt="..."
          width="65"
          class="mr-3 rounded-circle img-thumbnail shadow-sm"
        />
        <div class="media-body">
          <h4 class="m-0">{{ userDetails.name }}</h4>
          <p class="font-weight-light text-muted mb-0">
            {{ userDetails.email }}
          </p>
        </div>
      </div>
    </div>

    <ul class="nav flex-column">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="[
            focusDashboard
              ? 'selected bg-secondary'
              : 'text-secondary set-cursor',
          ]"
          @click="setFocus(DASHBOARD)"
        >
          <h4>
            <small><i class="bi bi-house-fill"></i></small>
            <span>&nbsp;Dashboard</span>
          </h4>
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="[
            focusManuscript
              ? 'selected bg-secondary'
              : 'text-secondary set-cursor',
          ]"
          @click="setFocus(MANUSCRIPT)"
        >
          <h4>
            <small><i class="bi bi-file-earmark-text-fill"></i></small>
            <span>&nbsp;Manuscript</span>
          </h4>
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="[
            focusSummary
              ? 'selected bg-secondary'
              : 'text-secondary set-cursor',
          ]"
          @click="setFocus(SUMMARY)"
        >
          <h4>
            <small><i class="bi bi-file-text-fill"></i></small>
            <span>&nbsp;Summary</span>
          </h4>
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="[
            focusFeedback
              ? 'selected bg-secondary'
              : 'text-secondary set-cursor',
          ]"
          @click="setFocus(FEEDBACK)"
        >
          <h4>
            <small><i class="bi bi-chat-left-dots-fill"></i></small>
            <span>&nbsp;Feedback</span>
          </h4>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SidebarMenu",
  data() {
    return {
      DASHBOARD: "dashboard",
      MANUSCRIPT: "manuscript",
      SUMMARY: "summary",
      FEEDBACK: "feedback",
      currentTab: "dashboard",
    };
  },
  computed: {
    userDetails() {
      return this.$store.getters.getCurrentUser;
    },
    focusDashboard() {
      return this.currentTab == "dashboard";
    },
    focusManuscript() {
      return this.currentTab == "manuscript";
    },
    focusSummary() {
      return this.currentTab == "summary";
    },
    focusFeedback() {
      return this.currentTab == "feedback";
    },
  },
  methods: {
    setFocus(currentTab) {
      this.currentTab = currentTab;
      switch (currentTab) {
        case "dashboard":
          this.$router.push("/dashboard");
          break;
        case "manuscript":
          this.$router.push("/manuscript");
          break;
        case "summary":
          this.$router.push("/summary");
          break;
        case "feedback":
          this.$router.push("/feedback");
          break;
        default:
          this.$router.push("/dashboard");
      }
    },
  },
};
</script>

<style>
.selected {
  pointer-events: none;
  color: white;
  cursor: default;
}
.set-cursor {
  cursor: pointer;
}
</style>
