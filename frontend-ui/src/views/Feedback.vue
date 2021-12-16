<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <h2><strong>Feedback Form</strong></h2>
        &nbsp;
        <h4>
          <p>
            We would like to hear your thoughts, suggestions or problems with
            anything so we can improve!
          </p>
        </h4>
      </div>
    </div>

    <br />

    <div class="row align-items-center">
      <div class="col-md-auto">
        <label for="fileDescription"><b>Feedback Type:</b></label>
      </div>
      <div class="col">
        <b-dropdown
          id="dropdown-left"
          :text="feedbackType"
          variant="none"
          class="me-3 customDropdown"
        >
          <b-dropdown-item disabled>Please select one</b-dropdown-item>
          <b-dropdown-item
            name="manuscript"
            @click="handleDropDownSelected($event)"
            >Manuscript</b-dropdown-item
          >
          <b-dropdown-item
            name="summary"
            @click="handleDropDownSelected($event)"
            >Summary</b-dropdown-item
          >
        </b-dropdown>
      </div>
    </div>

    <br />

    <hr />

    <br />

    <div v-if="showManuscriptQuestions">
      <div class="row">
        <h3 style="padding-left: 180px">
          <strong>Manuscript Feedback</strong>
        </h3>
        &nbsp;
        <div class="col-sm-12 form-group">
          <h5>
            <span class="required"></span>
            &nbsp;
            <strong
              >Please rate the performance of the Manuscript Generation
              feature.</strong
            >
          </h5>
          <p>
            <RadioButton
              v-for="(rating, index) in ratings"
              :key="index"
              :index="index"
              :rating="rating"
              :resetValue="resetValue"
              radioButtonName="q1"
              @clicked="onSelect"
            />
          </p>
        </div>

        <br />

        <div class="col-sm-12 form-group">
          <h5>
            <span class="required"></span>
            &nbsp;
            <strong>How would you rate the user experience?</strong>
          </h5>
          <p>
            <RadioButton
              v-for="(rating, index) in ratings"
              :key="index"
              :index="index"
              :rating="rating"
              :resetValue="resetValue"
              radioButtonName="q2"
              @clicked="onSelect"
            />
          </p>
        </div>

        <br />

        <div class="col-sm-12 form-group">
          <h5>
            <span class="required"></span>
            &nbsp;
            <strong
              >How would you rate the response time of our service?</strong
            >
          </h5>
          <p>
            <RadioButton
              v-for="(rating, index) in ratings"
              :key="index"
              :index="index"
              :rating="rating"
              :resetValue="resetValue"
              radioButtonName="q3"
              @clicked="onSelect"
            />
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 form-group">
          <label for="comments"> Comments:</label>
          <textarea
            class="form-control"
            type="textarea"
            placeholder="Your Comments"
            maxlength="500"
            rows="5"
            v-model="comment"
          ></textarea>
        </div>
      </div>

      &nbsp;
      <div class="row">
        <div class="form-group">
          <button
            type="submit"
            class="btn btn-lg btn-primary btn-block"
            v-on:click="onSubmit"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
    <div v-if="showSummaryQuestions">
      <div class="row">
        <h3 style="padding-left: 180px">
          <strong>Summary Feedback</strong>
        </h3>
        &nbsp;
        <div class="col-sm-12 form-group">
          <h5>
            <span class="required"></span>
            &nbsp;
            <strong
              >Please rate the performance of the Summary Generation
              feature.</strong
            >
          </h5>
          <p>
            <RadioButton
              v-for="(rating, index) in ratings"
              :key="index"
              :index="index"
              :rating="rating"
              :resetValue="resetValue"
              radioButtonName="q1"
              @clicked="onSelect"
            />
          </p>
        </div>

        <br />

        <div class="col-sm-12 form-group">
          <h5>
            <span class="required"></span>
            &nbsp;
            <strong>How would you rate the user experience?</strong>
          </h5>
          <p>
            <RadioButton
              v-for="(rating, index) in ratings"
              :key="index"
              :index="index"
              :rating="rating"
              :resetValue="resetValue"
              radioButtonName="q2"
              @clicked="onSelect"
            />
          </p>
        </div>

        <br />

        <div class="col-sm-12 form-group">
          <h5>
            <span class="required"></span>
            &nbsp;
            <strong
              >How would you rate the response time of our service?</strong
            >
          </h5>
          <p>
            <RadioButton
              v-for="(rating, index) in ratings"
              :key="index"
              :index="index"
              :rating="rating"
              :resetValue="resetValue"
              radioButtonName="q3"
              @clicked="onSelect"
            />
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 form-group">
          <label for="comments"> Comments:</label>
          <textarea
            class="form-control"
            type="textarea"
            placeholder="Your Comments"
            maxlength="500"
            rows="5"
            v-model="comment"
          ></textarea>
        </div>
      </div>

      &nbsp;
      <div class="row">
        <div class="form-group">
          <button type="submit" class="btn btn-lg btn-primary btn-block">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    RadioButton: () => import("../components/RadioButton.vue"),
  },
  name: "Feedback",
  data() {
    return {
      ratings: ["Very Poor", "Poor", "Average", "Good", "Very Good"],
      feedbackType: "Please select one",
      q1: "",
      q2: "",
      q3: "",
      comment: "",
      resetValue: 0,
      showManuscriptQuestions: false,
      showSummaryQuestions: false,
      radioButtonSelected: "",
    };
  },
  methods: {
    handleDropDownSelected(event) {
      this.resetValue = !this.resetValue;
      this.feedbackType = event.target.__vue__.$attrs.name;
      if (this.feedbackType == "manuscript") {
        this.showManuscriptQuestions = true;
        this.showSummaryQuestions = false;
      } else if (this.feedbackType == "summary") {
        this.showSummaryQuestions = true;
        this.showManuscriptQuestions = false;
      }
    },
    onSelect(rating, question) {
      if (question === "q1") {
        this.q1 = rating;
      } else if (question === "q2") {
        this.q2 = rating;
      } else if (question === "q3") {
        this.q3 = rating;
      }
    },
    async onSubmit() {
      const payload = {
        feedbackType: this.feedbackType,
        q1: this.q1,
        q2: this.q2,
        q3: this.q3,
        comment: this.comment,
      };

      const response = await this.$store.dispatch("submitFeedback", payload);

      console.log(response);
    },
  },
};
</script>

<style>
.required {
  font-weight: normal;
}
.required:after {
  color: #e32;
  font-size: 25px;
  content: "*";
  display: inline;
}
.customDropdown {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}

.customRadio {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
