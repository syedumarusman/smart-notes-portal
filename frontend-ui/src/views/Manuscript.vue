<template>
  <div class="row">
    <div class="col">
      <h2>Manuscript</h2>
      <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
      <button
        class="btn btn-primary"
        id="generateManuscript"
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

  methods: {
    handleFileUpload(){
      this.file = this.$refs.file.files[0];
    },
    async generateManuscript() {
      let formData = new FormData();

      formData.append('file', this.file);

      // axios.post( '/upload',
      //     formData,
      //     {
      //     headers: {
      //         'Accept': 'application/json',
      //         'Content-Type': 'multipart/form-data'
      //     }
      //   }
      // )
      // .then(function(){
      //     console.log('success');
      // })
      // .catch(function(){
      //     console.log('failed');
      // });
    },
  },
};
</script>

<style></style>
