<template>
  <div class="row">
    <div class="col">
      <h2>Manuscript</h2>
      <div class="alert alert-danger" role="alert" v-if="invalidFileType">
        {{ invalidFileError }}
      </div>
      <input type="file" id="file" v-on:change="handleFileUpload($event)" />
      <button
        class="btn btn-primary"
        id="generateManuscript"
        :disabled="!isDisabled"
        @click.prevent="generateManuscript"
      >
        Generate
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Manuscript",
  data() {
    return {
      file: "",
      invalidFileType: false,
      invalidFileError: "Invalid file type. Please upload a wav file!",
    };
  },
  computed: {
    isDisabled() {
      return typeof this.file == "object";
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
      if (file.type == "audio/wav") {
        this.file = file;
      } else {
        this.invalidFileType = true;
      }
    },
    async generateManuscript() {
      const response = await this.$store.dispatch(
        "generateManuscript",
        this.file
      );
      console.log(response);
      console.log("inside generate manuscript");
    },
  },
};
</script>

<style></style>
