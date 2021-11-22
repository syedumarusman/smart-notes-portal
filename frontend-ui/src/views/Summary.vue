<template>
  <div class="row">
    <div class="col">
      <h2><strong>Convert Your Text Into A Summary</strong></h2>
      <br />
      <div class="alert alert-danger" role="alert" v-if="invalidFileType">
        {{ invalidFileError }}
      </div>
      <!-- <div>
        <b-button v-b-modal.modal-1>Show Modal</b-button>

        <b-modal id="modal-1" title="Vue Js Bootstrap Modal Example">
          <p class="my-4">Content goes here...</p>
        </b-modal>
      </div> -->
      <div class="row-style">
        <input
          type="file"
          id="file"
          ref="fileupload"
          v-on:change="handleFileUpload($event)"
        />
        <input
          type="text"
          id="fileDescription"
          class="form-control me-3"
          placeholder="Description"
          v-model="description"
          required
          autofocus
        />
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
          @click.prevent="generateSummary"
          v-if="inProgress"
        >
          <LoadingComponent width="15"></LoadingComponent>
        </button>
      </div>
      <br />
      <br />
      <b-table />
    </div>
  </div>
</template>

<script>
import jsPDF from "jspdf";

export default {
  name: "Summary",
  components: {
    LoadingComponent: () => import("../components/LoadingComponent.vue"),
  },
  async created() {
    await this.getSummaryHistory();
  },
  data() {
    return {
      file: "",
      description: "",
      invalidFileType: false,
      inProgress: false,
      invalidFileError: "Invalid file type. Please upload a txt file!",
    };
  },
  computed: {
    isDisabled() {
      return typeof this.file !== "object" || this.inProgress;
    },
  },
  watch: {
    invalidFileType() {
      setTimeout(() => {
        this.invalidFileType = false;
      }, 4000);
    },
  },
  methods: {
    async getSummaryHistory() {
      console.log("get Summary list");
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        console.log(file);
        if (file.type == "text/plain") {
          this.file = file;
        } else {
          this.invalidFileType = true;
        }
      }
    },
    async generateSummary() {
      this.inProgress = true;
      const response = await this.$store.dispatch("generateSummary", this.file);
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
      this.file = "";
      this.$refs.fileupload.value = null;
      this.inProgress = false;

      // add text link to user's document in the database
      const textLink = response.data.gcs_uri;
      await this.$store.dispatch("addTextFile", textLink);
    },
  },
};
</script>

<style scoped>
.row-style {
  display: flex;
  justify-content: space-between;
}
</style>
