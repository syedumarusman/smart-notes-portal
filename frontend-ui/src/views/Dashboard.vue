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
        <div class="card bg-c-pink order-card">
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

      <div class="col">
        <div class="card bg-c-yellow order-card">
          <div class="card-block">
            <h3 class="m-b-20">Feedbacks</h3>
            <h1 class="text-right">
              <p class="f-right">
                <b-icon icon="chat-left-text"></b-icon>&nbsp;{{
                  this.getTotalFeedbackSubmissions
                }}
              </p>
            </h1>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-center">
      <div id="chart1" class="col-4">
        <apexchart
          v-if="!emptyChart"
          type="pie"
          width="600"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </div>
      <div id="chart2" class="col-4">
        <apexchart
          v-if="!emptyFeedbackChart"
          type="pie"
          width="625"
          :options="feedbackOptions"
          :series="feedbackSeries"
        ></apexchart>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "Dashboard",
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      series: [],
      feedbackSeries: [],
      getAudioTextCount: 0,
      getSummaryTextCount: 0,
      getTotalGenerations: 0,
      getTotalFeedbackSubmissions: 0,
      chartOptions: {
        title: {
          text: "Generation Service Usage",
          margin: 30,
          style: {
            fontSize: "20px",
            fontWeight: "bold",
            fontFamily: "Helvetica, Arial, sans-serif",
            color: "#263238",
          },
        },
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
      manuscriptFeedbackCount: 0,
      summaryFeedbackCount: 0,
      feedbackOptions: {
        title: {
          text: "Feedbacks Submitted",
          margin: 30,
          style: {
            fontSize: "20px",
            fontWeight: "bold",
            fontFamily: "Helvetica, Arial, sans-serif",
            color: "#263238",
          },
        },
        labels: ["Manuscript Feedbacks", "Summary Feedbacks"],
        colors: ["#6f42c1", "#fd7e14"],
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
  async created() {
    await this.getStats();
    this.series = [
      this.getAudioTextCount,
      this.getSummaryTextCount,
      this.getTotalFeedbackSubmissions,
      this.getTotalGenerations,
    ];
    this.feedbackSeries = [
      this.manuscriptFeedbackCount,
      this.summaryFeedbackCount,
    ];
  },
  computed: {
    emptyChart() {
      return (
        this.getAudioTextCount +
          this.getSummaryTextCount +
          this.getTotalGenerations ===
        0
      );
    },
    emptyFeedbackChart() {
      return this.manuscriptFeedbackCount + this.summaryFeedbackCount === 0;
    },
  },
  methods: {
    async getStats() {
      const {
        data: { data },
      } = await this.$store.dispatch("getUserDetails");

      this.getAudioTextCount = data.audioFiles.length;
      this.getSummaryTextCount = data.summaryFiles.length;
      this.getTotalGenerations =
        this.getAudioTextCount + this.getSummaryTextCount;

      this.manuscriptFeedbackCount = data.manuscriptFeedbacks.length;
      this.summaryFeedbackCount = data.summaryFeedbacks.length;
      this.getTotalFeedbackSubmissions =
        this.manuscriptFeedbackCount + this.summaryFeedbackCount;
    },
  },
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
