<template>
  <label class="radio-inline customRadio">
    <input
      class="form-check-input"
      type="radio"
      :name="radioButtonName"
      v-model="checked"
      :id="id"
      required
      v-on:click="selected($event)"
    />
    <label class="form-check-label customRadio" :for="id">
      {{ rating }}
    </label>
  </label>
</template>

<script>
export default {
  name: "radio-button",
  props: ["index", "rating", "resetValue", "radioButtonName"],
  data() {
    return {
      checked: 0,
    };
  },
  computed: {
    id() {
      return "radioButtonOption" + this.index + new Date().getTime();
    },
  },
  watch: {
    resetValue(oldVal, newVal) {
      if (oldVal !== newVal) this.reset();
    },
  },
  methods: {
    reset() {
      this.checked = 0;
    },
    selected() {
      this.$emit("clicked", this.rating, this.radioButtonName);
    },
  },
};
</script>

<style scoped>
.customRadio {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
