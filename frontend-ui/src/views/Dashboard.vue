<template>
  <div>
    <div class="row">
      <div class="col">
        <div class="card bg-c-blue order-card">
          <div class="card-block">
            <h3 class="m-b-20">Manuscript Generations</h3>
            <h1 class="text-right">
              <p class="f-right">
                <b-icon icon="file-earmark-text"></b-icon>&nbsp;{{
                  this.getAudioTextCount
                }}
              </p>
            </h1>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="card bg-c-green order-card">
          <div class="card-block">
            <h3 class="m-b-20">Summary Generations</h3>
            <h1 class="text-right">
              <p class="f-right">
                <b-icon icon="file-text"></b-icon>&nbsp;{{
                  this.getSummaryTextCount
                }}
              </p>
            </h1>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="card bg-c-yellow order-card">
          <div class="card-block">
            <h3 class="m-b-20">Total Generations</h3>
            <h1 class="text-right">
              <p class="f-right">
                <b-icon icon="layers"></b-icon>&nbsp;{{
                  this.getTotalGenerations
                }}
              </p>
            </h1>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-center">
      <div id="chart" class="col-4">
        <apexchart
          v-if="!emptyChart"
          type="pie"
          width="600"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VueApexCharts from "vue-apexcharts";

export default {
  name: "Dashboard",
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      series: [],
      chartOptions: {
        labels: ["Manuscripts", "Summaries", "Feedbacks", "Total Generations"],
        legend: {
          show: true,
          fontSize: "14px",
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "16px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "bold",
          },
        },
      },
    };
  },
  created() {
    this.series = [
      this.getAudioTextCount,
      this.getSummaryTextCount,
      0,
      this.getTotalGenerations,
    ];
  },
  computed: {
    ...mapGetters([
      "getAudioTextCount",
      "getSummaryTextCount",
      "getTotalGenerations",
    ]),
    emptyChart() {
      return (
        this.getAudioTextCount +
          this.getSummaryTextCount +
          this.getTotalGenerations ===
        0
      );
    },
  },
  methods: {},
};
</script>

<style>
.order-card {
  color: #fff;
}

.bg-c-blue {
  background: linear-gradient(45deg, #4099ff, #73b4ff);
}

.bg-c-green {
  background: linear-gradient(45deg, #2ed8b6, #59e0c5);
}

.bg-c-yellow {
  background: linear-gradient(45deg, #ffb64d, #ffcb80);
}

.bg-c-pink {
  background: linear-gradient(45deg, #ff5370, #ff869a);
}

.card {
  border-radius: 5px;
  -webkit-box-shadow: 0 1px 2.94px 0.06px rgba(4, 26, 55, 0.16);
  box-shadow: 0 1px 2.94px 0.06px rgba(4, 26, 55, 0.16);
  border: none;
  margin-bottom: 30px;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

.card .card-block {
  padding: 25px;
}

.f-left {
  float: left;
}

.f-right {
  float: right;
}
</style>
