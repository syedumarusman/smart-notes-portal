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
            @click="handleDropDownSelected(manuscript)"
            >Manuscript</b-dropdown-item
          >
          <b-dropdown-item
            name="summary"
            @click="handleDropDownSelected(summary)"
            >Summary</b-dropdown-item
          >
        </b-dropdown>
      </div>
    </div>

    <br />

    <hr />

    <br />

    <div class="alert alert-danger" role="alert" v-if="invalidFeedbackForm">
      {{ invalidFeedbackError }}
    </div>
    <div class="alert alert-success" role="alert" v-if="feedbackSubmitted">
      {{ successMessage }}
    </div>

    <br />

    <div v-if="showManuscriptQuestions">
      <div class="row">
        <h3 style="padding-left: 180px">
          <strong>Manuscript Feedback</strong>
        </h3>
        &nbsp;
        <div class="col form-group">
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
      </div>
      <br />
      <div class="row">
        <div class="col form-group">
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
      </div>
      <br />
      <div class="row">
        <div class="col form-group">
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
      <br />
      <div class="row">
        <div class="col-sm-4 form-group">
          <span class="required"></span> &nbsp;
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
      <br />
      <div class="row">
        <div class="form-group">
          <button
            type="submit"
            class="btn btn-lg btn-primary btn-block"
            v-on:click="showModal()"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
    <div v-if="showSummaryQuestions">
      <h3 style="padding-left: 180px">
        <strong>Summary Feedback</strong>
      </h3>
      <div class="row">
        <div class="col form-group">
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
      </div>
      <br />
      <div class="row">
        <div class="col form-group">
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
      </div>
      <br />
      <div class="row">
        <div class="col form-group">
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
      <br />
      <div class="row">
        <div class="col-sm-4 form-group">
          <span class="required"></span> &nbsp;
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
      <br />
      <div class="row">
        <div class="form-group">
          <button
            type="submit"
            class="btn btn-lg btn-primary btn-block"
            v-on:click="showModal()"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
    <b-modal
      :id="submitModal.id"
      :title="submitModal.title"
      ok-variant="primary"
      @ok="onSubmit()"
    >
      <p>
        {{ submitModal.content }}
      </p>
    </b-modal>
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
      manuscript: "manuscript",
      summary: "summary",
      feedbackType: "Please select one",
      submitModal: {
        id: "submit-modal",
        title: "",
        content: "",
      },
      q1: "",
      q2: "",
      q3: "",
      comment: "",
      resetValue: 0,
      showManuscriptQuestions: false,
      showSummaryQuestions: false,
      radioButtonSelected: "",
      invalidFeedbackForm: false,
      invalidFeedbackError:
        "Invalid Feedback Form. Please fill out all required fields!",
      feedbackSubmitted: false,
      successMessage: "Feedback has been successfully submitted!",
    };
  },
  watch: {
    invalidFeedbackForm() {
      setTimeout(() => {
        this.invalidFeedbackForm = false;
      }, 5000);
    },
    feedbackSubmitted() {
      setTimeout(() => {
        this.feedbackSubmitted = false;
      }, 5000);
    },
  },
  methods: {
    handleDropDownSelected(name) {
      this.resetValue = !this.resetValue;
      this.comment = "";
      this.feedbackType = name;
      if (this.feedbackType == "manuscript") {
        this.showManuscriptQuestions = true;
        this.showSummaryQuestions = false;
      } else if (this.feedbackType == "summary") {
        this.showSummaryQuestions = true;
        this.showManuscriptQuestions = false;
      } else {
        this.showManuscriptQuestions = false;
        this.showSummaryQuestions = false;
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
    showModal() {
      this.submitModal.title = `Submitting Feedback for ${this.feedbackType}`;
      this.submitModal.content = `Are you sure you want to submit feedback for ${this.feedbackType}?`;
      this.$root.$emit("bv::show::modal", this.submitModal.id);
    },
    validateFields() {
      if (
        this.q1 === "" ||
        this.q2 === "" ||
        this.q3 === "" ||
        this.comment === ""
      ) {
        this.invalidFeedbackForm = true;
        return false;
      }
      return true;
    },
    async onSubmit() {
      const payload = {
        feedbackType: this.feedbackType,
        q1: this.q1,
        q2: this.q2,
        q3: this.q3,
        comment: this.comment,
      };
      if (this.validateFields()) {
        const response = await this.$store.dispatch("submitFeedback", payload);
        if (response.data) {
          this.feedbackSubmitted = true;
          this.handleDropDownSelected("Please select one");
        }
      }
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
