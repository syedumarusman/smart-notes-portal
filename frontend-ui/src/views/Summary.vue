<template>
  <div class="container-fluid">
    <div class="row">
      <h2><strong>Convert Your Text Into A Summary</strong></h2>
      <div class="alert alert-danger" role="alert" v-if="invalidFileType">
        {{ invalidFileError }}
      </div>
    </div>

    <br />

    <div class="row">
      <input
        type="file"
        id="file"
        ref="fileupload"
        v-on:change="handleFileUpload($event)"
      />
    </div>

    <br />
    <div class="row align-items-center">
      <div class="col-md-auto">
        <label for="fileDescription"><b>Summary Sentence Count:</b></label>
      </div>
      <div class="col">
        <b-dropdown
          id="dropdown-left"
          :text="selected"
          variant="none"
          class="me-3 customDropdown"
        >
          <b-dropdown-item @click="selected = 'Please select one'"
            >Please select one</b-dropdown-item
          >
          <b-dropdown-item @click="selected = '5'">5</b-dropdown-item>
          <b-dropdown-item @click="selected = '10'">10</b-dropdown-item>
          <b-dropdown-item @click="selected = '20'">20</b-dropdown-item>
          <b-dropdown-item @click="selected = '50'">50</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>

    <br />
    <div class="row align-items-center">
      <div class="col-md-auto">
        <label for="fileDescription"><b>Description:</b></label
        ><span class="required"> (required)</span>
      </div>
      <div class="col-md-9">
        <b-form-input
          type="text"
          id="fileDescription"
          placeholder="Description"
          v-model="description"
          v-on:blur="checkDescription"
          required
          autofocus
        />
      </div>
      <div class="col-md-auto">
        <button
          class="btn btn-primary"
          id="generateSummary"
          :disabled="isDisabled"
          @click.prevent="generateSummary"
          v-if="!inProgress"
        >
          Generate
        </button>
        <button
          class="btn btn-primary"
          id="generateLoadingComponent"
          disabled
          v-if="inProgress"
        >
          <LoadingComponent width="15"></LoadingComponent>
        </button>
      </div>
    </div>

    <br />
    <b-table
      :fields="headings"
      :items="summaryHistory"
      hover
      head-variant="dark"
      v-if="summaryHistory.length"
    >
      <template #cell(actions)="row">
        <b-button
          id="show-btn"
          variant="danger"
          title="Delete File"
          @click="showModal(row.item, $event.target)"
          >Delete
        </b-button>
        &nbsp;
        <b-button
          id="download-btn"
          variant="success"
          title="Download File"
          @click="downloadFile(row)"
          ><b-icon icon="cloud-download" aria-hidden="true"></b-icon>
        </b-button>
      </template>
    </b-table>

    <b-modal
      :id="deleteModal.id"
      :title="deleteModal.title"
      ok-variant="danger"
      @ok="removeSummary(deleteModal.row)"
    >
      <p>
        Are you sure you want to delete
        {{ deleteModal.content }}
        ?
      </p>
    </b-modal>
  </div>
</template>

<script>
import jsPDF from "jspdf";

export default {
  name: "Summary",
  components: {
    LoadingComponent: () => import("../components/LoadingComponent.vue"),
  },
  data() {
    return {
      file: null,
      selected: "Please select one",
      description: "",
      headings: ["No.", "summary_file", "description", "created", "actions"],
      deleteModal: {
        id: "delete-modal",
        title: "",
        row: null,
        content: "",
      },
      summaryHistory: [],
      inProgress: false,
      descriptionExists: false,
      isEmptyError: "Description Cannot be left blank!",
      invalidFileType: false,
      invalidFileError: "Invalid file type. Please upload a text file!",
      fileExists: false,
      fileNotFoundError: "File not found. Please upload a file!",
    };
  },
  created() {
    this.getSummaryHistory();
  },
  computed: {
    isDisabled() {
      return (
        this.file === null || this.description.length === 0 || this.inProgress
      );
    },
  },
  watch: {
    invalidFileType() {
      setTimeout(() => {
        this.invalidFileType = false;
      }, 4000);
    },
    descriptionExists() {
      setTimeout(() => {
        this.descriptionExists = false;
      }, 4000);
    },
    fileExists() {
      setTimeout(() => {
        this.fileExists = false;
      }, 4000);
    },
  },
  methods: {
    async getSummaryHistory() {
      const { data } = await this.$store.dispatch("getUserDetails");
      const summaryFiles = data.data.summaryFiles.map((summaryFile, index) => {
        const { _id, gcs_uri, description, created } = summaryFile;
        return {
          _id,
          "No.": index + 1,
          summary_file: gcs_uri,
          description: description,
          created: created,
        };
      });
      this.summaryHistory = summaryFiles;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        this.$refs.fileupload.value = null;
        this.file = null;
        return;
      }
      if (file.type == "text/plain") {
        this.file = file;
      } else {
        this.invalidFileType = true;
        this.$refs.fileupload.value = null;
        this.file = null;
      }
    },
    checkDescription() {
      return this.description.length === 0;
    },
    showModal(row, button) {
      this.deleteModal.title = `Deleting Summary ${
        row.summary_file.split("/").slice(-1)[0]
      }`;
      this.deleteModal.content = row.summary_file.split("/").slice(-1)[0];
      this.deleteModal.row = row;
      this.$root.$emit("bv::show::modal", this.deleteModal.id, button);
    },
    async removeSummary(data) {
      const gcs_uri = data.summary_file;
      const _id = data._id;
      const payload = { _id, gcs_uri };
      await this.$store.dispatch("removeSummaryFile", payload);
      await this.getSummaryHistory();
    },
    async downloadFile(row) {
      const {
        data: { data },
      } = await this.$store.dispatch("getUserDetails");
      const _id = row.item._id;
      let doc = new jsPDF();
      let lineNum = 20;
      doc
        .setFont(undefined, "bold")
        .text("Summary", 90, 10)
        .setFont(undefined, "normal");
      const currentSummaryList = data.summaryFiles;
      const subList = currentSummaryList.find((item) => item._id === _id);
      let splitText = doc.splitTextToSize(subList[1], 180);
      doc.text(20, lineNum, splitText);
      const pdfName = row.item.summary_file.split("/").slice(-1)[0];
      doc.save(pdfName + ".pdf");
    },
    async generateSummary() {
      this.inProgress = true;
      const sentenceCount = isNaN(parseInt(this.selected))
        ? undefined
        : parseInt(this.selected);
      const payload = { file: this.file, sentenceCount };
      const response = await this.$store.dispatch("generateSummary", payload);
      const summaryData = response.data.sentences;
      if (summaryData.length === 0) {
        this.$refs.fileupload.value = null;
        this.file = null;
        this.inProgress = false;
        return;
      }
      // export api response into a pdf file
      let pdfName = this.file.name;
      var doc = new jsPDF();
      var lineNum = 20;
      doc
        .setFont(undefined, "bold")
        .text("Summary", 90, 10)
        .setFont(undefined, "normal");
      summaryData.forEach((sentence) => {
        var splitText = doc.splitTextToSize(sentence, 180);
        doc.text(20, lineNum, splitText);
        lineNum += 30;
      });
      doc.save(pdfName + ".pdf");
      this.$refs.fileupload.value = null;
      this.file = null;
      this.inProgress = false;

      // add summary details to the database
      const gcs_uri = response.data.gcs_uri;
      const created = new Date().toLocaleDateString();
      const requestPayload = {
        gcs_uri,
        description: this.description,
        created,
      };
      this.description = "";
      await this.$store.dispatch("addSummaryFile", requestPayload);
      await this.getSummaryHistory();
    },
  },
};
</script>

<style scoped>
.required {
  font-weight: normal;
}
.required:after {
  color: #e32;
  content: " *";
  display: inline;
}
.customDropdown {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
</style>
