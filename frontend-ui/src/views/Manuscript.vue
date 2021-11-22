<template>
  <div class="container-fluid">
    <h2><strong>Convert Your Audio Into Text Manuscript</strong></h2>
    <br />
    <div class="alert alert-danger" role="alert" v-if="invalidFileType">
      {{ invalidFileError }}
    </div>
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

    <br />
    <b-table
      :fields="headings"
      :items="manuscriptHistory"
      head-variant="dark"
      v-if="manuscriptHistory.length"
    />

    <div>
      <b-button v-b-modal.modal-1>Show Modal</b-button>

      <b-modal id="modal-1" title="Vue Js Bootstrap Modal Example">
        <p class="my-4">Content goes here...</p>
      </b-modal>
    </div>
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
      headings: ["No.", "audio_file", "description", "created"],
      manuscriptHistory: [],
      inProgress: false,
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
      const { data } = await this.$store.dispatch("getManuscriptList");
      const audioFiles = data.data.audioFiles.map((audioFile, index) => {
        audioFile.gcs_uri = audioFile.gcs_uri.split("/").slice(-1)[0];
        const { gcs_uri, description, created } = audioFile;
        return {
          "No.": index + 1,
          audio_file: gcs_uri,
          description: description,
          created: created,
        };
      });
      console.log(audioFiles);
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
      }
    },
    checkDescription() {
      return this.description.length === 0;
    },
    async generateManuscript() {
      this.inProgress = true;
      const response = await this.$store.dispatch(
        "generateManuscript",
        this.file
      );
      const sentenceInfo = response.data.transcript;
      // export api response into a pdf file
      let pdfName = this.file.name;
      var doc = new jsPDF();
      var lineNum = 20;
      sentenceInfo.forEach((sentence, index) => {
        const key = Object.keys(sentence)[0];
        const speech = sentence[key];
        const speakerSentence = `Sentence ${index + 1}: ${speech}`;
        var splitText = doc.splitTextToSize(speakerSentence, 180);
        doc.text(20, lineNum, splitText);
        lineNum += 20;
      });
      doc.save(pdfName + ".pdf");
      this.$refs.fileupload.value = null;
      this.file = null;
      this.inProgress = false;

      // add audio link to user's document in the database
      const gcs_uri = response.data.gcs_uri;
      const created = new Date().toLocaleDateString();
      const payload = { gcs_uri, description: this.description, created };
      await this.$store.dispatch("addAudioFile", payload);
      this.description = "";
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
</style>
