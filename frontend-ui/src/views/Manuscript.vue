<template>
  <div class="container-fluid">
    <div class="row">
      <h2><strong>Convert Your Audio Into Text Manuscript</strong></h2>
      <br />
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
        <label for="fileDescription"><b>Speaker Count:</b></label>
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
          <b-dropdown-item @click="selected = '1'">1</b-dropdown-item>
          <b-dropdown-item @click="selected = '2'">2</b-dropdown-item>
          <b-dropdown-item @click="selected = '3'">3</b-dropdown-item>
          <b-dropdown-item @click="selected = '4'">4</b-dropdown-item>
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
        <input
          type="text"
          id="fileDescription"
          class="form-control me-3"
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
          id="generateManuscript"
          :disabled="isDisabled"
          @click.prevent="generateManuscript"
          v-if="!inProgress"
        >
          Generate
        </button>
        <button
          class="btn btn-primary"
          id="generateLoadingComponent"
          disabled
          @click.prevent="generateManuscript"
          v-if="inProgress"
        >
          <LoadingComponent width="15"></LoadingComponent>
        </button>
      </div>
    </div>
    &nbsp;

    <br />
    <b-table
      :fields="headings"
      hover
      :items="manuscriptHistory"
      head-variant="dark"
      v-if="manuscriptHistory.length"
    >
      <template #cell(actions)="row">
        <b-row>
          <b-col sm="3">
            <button
              class="btn btn-danger w-100"
              variant="danger"
              title="Delete File"
              @click="showModal(row.item, $event.target)"
            >
              Delete
            </button>
          </b-col>
          <b-col sm="3">
            <button
              class="btn btn-success w-100"
              variant="success"
              title="Download File"
              @click="downloadFile(row)"
              v-if="row.item._id !== downloadId"
            >
              <b-icon icon="cloud-download" aria-hidden="true"></b-icon>
            </button>
            <button
              class="btn btn-success w-100"
              variant="success"
              disabled
              v-if="row.item._id === downloadId"
            >
              <LoadingComponent width="15"></LoadingComponent>
            </button>
          </b-col>
        </b-row>
      </template>
    </b-table>

    <b-modal
      :id="deleteModal.id"
      :title="deleteModal.title"
      ok-variant="danger"
      @ok="removeHistory(deleteModal.row)"
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
  name: "Manuscript",
  components: {
    LoadingComponent: () => import("../components/LoadingComponent.vue"),
  },
  data() {
    return {
      file: null,
      description: "",
      selected: "Please select one",
      headings: ["No.", "audio_file", "description", "created", "actions"],
      manuscriptHistory: [],
      inProgress: false,
      downloadId: "",
      deleteModal: {
        id: "delete-modal",
        title: "",
        row: null,
        content: "",
      },
      descriptionExists: false,
      isEmptyError: "Description Cannot be left blank!",
      invalidFileType: false,
      invalidFileError: "Invalid file type. Please upload a wav file!",
      fileExists: false,
      fileNotFoundError: "File not found. Please upload a file!",
    };
  },
  created() {
    this.getManuscriptHistory();
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
    async getManuscriptHistory() {
      const { data } = await this.$store.dispatch("getUserDetails");
      const audioFiles = data.data.audioFiles.map((audioFile, index) => {
        const { _id, gcs_uri, description, created } = audioFile;
        return {
          _id,
          "No.": index + 1,
          audio_file: gcs_uri,
          description: description,
          created: created,
        };
      });
      this.manuscriptHistory = audioFiles;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        this.$refs.fileupload.value = null;
        this.file = null;
        return;
      }
      if (file.type == "audio/wav") {
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
      this.deleteModal.title = `Deleting Audio ${
        row.audio_file.split("/").slice(-1)[0]
      }`;
      this.deleteModal.content = row.audio_file.split("/").slice(-1)[0];
      this.deleteModal.row = row;
      this.$root.$emit("bv::show::modal", this.deleteModal.id, button);
    },
    async downloadFile(row) {
      this.downloadId = row.item._id;
      const {
        data: { data },
      } = await this.$store.dispatch("getUserDetails");
      const _id = row.item._id;
      let doc = new jsPDF();
      let lineNum = 20;
      doc
        .setFont(undefined, "bold")
        .text("Manuscript", 90, 10)
        .setFont(undefined, "normal");
      const currentAudioList = data.audioFiles;
      const fileObject = currentAudioList.find((item) => item._id == _id);
      const gcs_uri = fileObject.gcs_uri;
      const response = await this.$store.dispatch("getManuscript", gcs_uri);
      const sentenceInfo = response.data.transcript;
      // export api response into a pdf file
      let pdfName = gcs_uri.split("/")[3];
      var docText = "";
      sentenceInfo.forEach((sentence) => {
        const key = Object.keys(sentence)[0];
        const speech = sentence[key];
        const speaker = key.split(/(\d+)/);
        const speakerSentence = `${speaker[0]} ${speaker[1]}: ${speech}`;
        var splitText = doc.splitTextToSize(speakerSentence, 180);
        docText += splitText + "\n";
        doc.text(20, lineNum, splitText);
        if (docText.length >= 800) lineNum += 50;
        else if (docText.length >= 400) lineNum += 40;
        else if (docText.length >= 200) lineNum += 30;
        else lineNum += 20;
      });
      doc.save(pdfName + ".pdf");
      this.downloadId = "";
    },
    async removeHistory(data) {
      const gcs_uri = data.audio_file;
      const _id = data._id;
      const payload = { _id, gcs_uri };
      await this.$store.dispatch("removeAudioFile", payload);
      await this.getManuscriptHistory();
    },
    async generateManuscript() {
      this.inProgress = true;
      const speakerCount = isNaN(parseInt(this.selected))
        ? undefined
        : parseInt(this.selected);
      const requestPayload = { file: this.file, speakerCount };
      const response = await this.$store.dispatch(
        "generateManuscript",
        requestPayload
      );
      const sentenceInfo = response.data.transcript;
      // export api response into a pdf file
      let pdfName = this.file.name;
      var doc = new jsPDF();
      var docText = "";
      var lineNum = 20;
      doc
        .setFont(undefined, "bold")
        .text("Manuscript", 90, 10)
        .setFont(undefined, "normal");
      sentenceInfo.forEach((sentence) => {
        const key = Object.keys(sentence)[0];
        const speech = sentence[key];
        const speaker = key.split(/(\d+)/);
        const speakerSentence = `${speaker[0]} ${speaker[1]}: ${speech}`;
        var splitText = doc.splitTextToSize(speakerSentence, 180);
        docText += splitText + "\n";
        doc.text(20, lineNum, splitText);
        if (docText.length >= 800) lineNum += 50;
        else if (docText.length >= 400) lineNum += 40;
        else if (docText.length >= 200) lineNum += 30;
        else lineNum += 20;
      });
      doc.save(pdfName + ".pdf");
      this.$refs.fileupload.value = null;
      this.file = null;
      this.inProgress = false;

      // add audio link to user's document in the database
      const gcs_uri = response.data.gcs_uri;
      const created = new Date().toLocaleDateString();
      const payload = {
        gcs_uri,
        description: this.description,
        created,
      };
      this.description = "";
      await this.$store.dispatch("addAudioFile", payload);
      await this.getManuscriptHistory();
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
