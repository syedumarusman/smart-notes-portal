<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <h2><strong>Feedback Form</strong></h2>
        &nbsp;
        <h4>
          <strong
            >We would like to hear your thoughts, suggestions or problems with
            anything so we can improve!</strong
          >
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
          :text="dropdownSelected"
          variant="none"
          class="me-3 customDropdown"
        >
          <b-dropdown-item disabled>Please select one</b-dropdown-item>
          <b-dropdown-item
            name="Manuscript"
            @click="handleDropDownSelected($event)"
            >Manuscript</b-dropdown-item
          >
          <b-dropdown-item
            name="Summary"
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
            name="comments"
            id="comments"
            placeholder="Your Comments"
            maxlength="6000"
            rows="7"
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
    <div v-if="showSummaryQuestions">
      <div class="row">
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
            name="comments"
            id="comments"
            placeholder="Your Comments"
            maxlength="6000"
            rows="7"
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
      resetValue: 0,
      showManuscriptQuestions: false,
      showSummaryQuestions: false,
      dropdownSelected: "Please select one",
      radioButtonSelected: "",
    };
  },
  methods: {
    handleDropDownSelected(event) {
      this.resetValue = !this.resetValue;
      this.dropdownSelected = event.target.__vue__.$attrs.name;
      if (this.dropdownSelected == "Manuscript") {
        this.showManuscriptQuestions = true;
        this.showSummaryQuestions = false;
      } else if (this.dropdownSelected == "Summary") {
        this.showSummaryQuestions = true;
        this.showManuscriptQuestions = false;
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
