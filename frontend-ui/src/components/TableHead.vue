<template>
  <thead class="table-dark">
    <tr>
      <th scope="col" v-for="(heading, index) in headings" :key="index">
        {{ heading }}
      </th>
    </tr>
  </thead>
</template>

<script>
export default {
  props: ["headings"],
};
</script>

<style></style>
