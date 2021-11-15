<template>
  <tbody>
    <tr v-for="(row, index) in rows" :key="index">
      <th scope="row">{{ index + 1 }}</th>
      <td v-for="(attribute, index) in row" :key="index">
        {{ attribute }}
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {
  props: ["rows"],
};
</script>

<style></style>
