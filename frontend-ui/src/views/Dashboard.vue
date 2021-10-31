<template>
  <div class="dashboard">
    <h1>Logged into Dashboard</h1>
    <div class="vertical-nav bg-white" id="sidebar">
    <div class="py-4 px-3 mb-4 bg-light">
      <div class="media d-flex"><img src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png" alt="..." width="65" class="mr-3 rounded-circle img-thumbnail shadow-sm">
        <div class="media-body">
          <h4 class="m-0">Test1</h4>
          <p class="font-weight-light text-muted mb-0">Full Stack developer</p>
        </div>
      </div>
    </div>
  
    <ul class="nav flex-column bg-white">
      <li class="nav-item">
        <a href="#" class="nav-link text-dark font-italic" :class="{'bg-light': focusDashboard}" @click="setFocus(DASHBOARD)">
            <i class="fa fa-th-large mr-3 text-primary fa-fw"></i>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>
                <path fill-rule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>
            </svg>
            Dashboard
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link text-dark font-italic" :class="{'bg-light': focusManuscript}" @click="setFocus(MANUSCRIPT)">
            <i class="fa fa-address-card mr-3 text-primary fa-fw"></i>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-journal-text" viewBox="0 0 16 16">
              <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
              <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
              <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
            </svg>
            Manuscript
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link text-dark font-italic" :class="{'bg-light': focusSummary}" @click="setFocus(SUMMARY)">
            <i class="fa fa-cubes mr-3 text-primary fa-fw"></i>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-file-text" viewBox="0 0 16 16">
              <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z"/>
              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
            </svg>
            Summary
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link text-dark font-italic" :class="{'bg-light': focusFeedback}" @click="setFocus(FEEDBACK)">
            <i class="fa fa-picture-o mr-3 text-primary fa-fw"></i>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16">
              <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
              <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
            </svg>
            Feedback
        </a>
      </li>
    </ul>
  </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      DASHBOARD: "dashboard",
      MANUSCRIPT: "manuscript",
      SUMMARY: "summary",
      FEEDBACK: "feedback",
      currentTab: "",
    };
  },
  computed: {
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
    }
  },
};
</script>

<style>
.vertical-nav {
  min-width: 17rem;
  width: 17rem;
  height: 100vh;
  position: fixed;
  text-align: start;
  margin-top: 55px;
  top: 0;
  left: 0;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.4s;
}
.page-content {
  width: calc(100% - 17rem);
  margin-left: 17rem;
  transition: all 0.4s;
}
#content.active {
  width: 100%;
  margin: 0;
}
@media (max-width: 768px) {
  #sidebar {
    margin-left: -17rem;
  }
  #sidebar.active {
    margin-left: 0;
  }
  #content {
    width: 100%;
    margin: 0;
  }
  #content.active {
    margin-left: 17rem;
    width: calc(100% - 17rem);
  }
}
body {
  background: #fafafa;
  background: -webkit-linear-gradient(to right, #599fd9, #c2e59c);
  background: linear-gradient(to right, #599fd9, #c2e59c);
  min-height: 100vh;
  overflow-x: hidden;
}
.separator {
  margin: 3rem 0;
  border-bottom: 1px dashed #fff;
}
.text-uppercase {
  letter-spacing: 0.1em;
}
.text-gray {
  color: #aaa;
}
</style>