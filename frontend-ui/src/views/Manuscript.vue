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
    &nbsp;
    <!-- <div>
      <b-progress
        class="w-75"
        :value="progressValue"
        variant="success"
        striped
        show-progress
        show-value
        animated="animated"
        v-show="true"
      ></b-progress>
    </div> -->

    <br />
    <b-table
      :fields="headings"
      hover
      :items="manuscriptHistory"
      head-variant="dark"
      v-if="manuscriptHistory.length"
    >
      <template #cell(actions)="row">
        <b-button
          id="show-btn"
          title="Delete File"
          @click="showModal(row.item, $event.target)"
          >Delete
        </b-button>
        &nbsp;
        <b-button
          id="download-btn"
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
      headings: ["No.", "audio_file", "description", "created", "actions"],
      manuscriptHistory: [],
      inProgress: false,
      timer: null,
      progressValue: 0,
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
      const { data } = await this.$store.dispatch("getManuscriptList");
      const audioFiles = data.data.audioFiles.map((audioFile, index) => {
        //audioFile.gcs_uri = audioFile.gcs_uri.split("/").slice(-1)[0];          BREAKS DELETION
        const { gcs_uri, description, created } = audioFile;
        return {
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
      const index = row.item["No."];
      var doc = new jsPDF();
      var lineNum = 20;
      var splitText = doc.splitTextToSize(
        this.$store.getters.getAudioText[index],
        180
      );
      doc.text(20, lineNum, splitText);
      const pdfName = row.item.audio_file.split("/").slice(-1)[0];
      doc.save(pdfName + ".pdf");
    },
    async removeHistory(data) {
      const gcs_uri = data.audio_file;
      const description = data.description;
      const created = data.created;
      const payload = { gcs_uri, description, created };
      await this.$store.dispatch("removeAudioFile", payload);
      await this.getManuscriptHistory();
    },
    // loadProgressBar() {
    //   while (this.progressValue < 100) {
    //     console.log("Progress value: ", this.progressValue);
    //     this.progressValue += 10;
    //   }
    // },
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
      var docText = "";
      var lineNum = 20;
      //this.loadProgressBar();
      sentenceInfo.forEach((sentence) => {
        const key = Object.keys(sentence)[0];
        const speech = sentence[key];
        const speaker = key.split(/(\d+)/);
        const speakerSentence = `${speaker[0]} ${speaker[1]}: ${speech}`;
        var splitText = doc.splitTextToSize(speakerSentence, 180);
        docText += splitText + "\n";
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
      const payload = {
        gcs_uri,
        description: this.description,
        created,
        docText,
      };
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
