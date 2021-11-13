<template>
  <div class="row">
    <div class="col">
      <h2>Manuscript</h2>
      <div class="alert alert-danger" role="alert" v-if="invalidFileType">
        {{ invalidFileError }}
      </div>
      <input
        type="file"
        id="file"
        ref="fileupload"
        v-on:change="handleFileUpload($event)"
      />
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
      file: "",
      invalidFileType: false,
      inProgress: false,
      invalidFileError: "Invalid file type. Please upload a wav file!",
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
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.type == "audio/wav") {
          this.file = file;
        } else {
          this.invalidFileType = true;
        }
      }
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
      this.file = "";
      this.$refs.fileupload.value = null;
      this.inProgress = false;

      // add audio link to user's document in the database
      const audioLink = response.data.gcs_uri;
      await this.$store.dispatch("addAudioFile", audioLink);
    },
  },
};
</script>

<style></style>
