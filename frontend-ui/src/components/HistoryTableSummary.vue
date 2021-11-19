<template>
  <div class="table-responsive">
    <table class="table">
      <TableHead :headings="headings" />
      <TableRow :rows="rows" />
    </table>
  </div>
</template>

<script>
export default {
  components: {
    TableHead: () => import("./TableHead.vue"),
    TableRow: () => import("./TableRow.vue"),
  },
  data() {
    return {
      headings: ["#", "Description", "Location", "Created"],
      rows: [
        {
          description: "Text 1",
          location: "abc/def",
          created: "11/12/2021",
        },
        {
          description: "Text 2",
          location: "abc/def",
          created: "11/11/2021",
        },
        {
          description: "Text 3",
          location: "abc/def",
          created: "11/10/2021",
        },
      ],
    };
  },
};
</script>

<style></style>
