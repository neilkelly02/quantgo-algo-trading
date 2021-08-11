<template>
<!-- Author: Neil Kelly
NetID: nk220 -->
  <div class="user-input-form">
    <b-card id = "user_input_form">
        <b-form 
            @submit = "onSubmit"
            :novalidate = true>

            <h1>My Algorithm Parameters</h1>
            <b-form-group
                v-for = "(field, i) in this.inputForm.stock_info_fields"
                :key = "i + 'stock_info'"
                :label = 'field.text'
                :label-for = 'field.id'
                :description = 'field.errorMessage'>
                <div v-if = "field.type === 'text'">
                    <b-form-input
                        :id = 'field.id'
                        v-model = 'field.answer'
                        :type = 'field.type'
                        :placeholder = 'field.placeholder'
                        :state = 'isValidated(field)'>
                        
                    </b-form-input>
                </div>
            </b-form-group>

            <h2>Entry Strategy</h2>
            <b-form-group
                v-for = "(field, i) in this.inputForm.moving_average_param_fields"
                :key = "i + 'moving_avgerage'"
                :label = 'field.text'
                :label-for = 'field.id'
                :description = 'field.errorMessage'>
                <div v-if = "field.type === 'text'">
                    <b-form-input
                        :id = 'field.id'
                        v-model = 'field.answer'
                        :type = 'field.type'
                        :placeholder = 'field.placeholder'
                        :state = 'isValidated(field)'>
                        
                    </b-form-input>
                </div>
            </b-form-group>

            <b-button type = 'submit' variant = 'primary'>Run Algorithm</b-button>

        </b-form>
    </b-card>
  </div>
</template>

<script>
import InputFormData from '../data/input_form_data.json';

export default {
  name: 'InputForm',
  data(){
      return{
          inputForm : InputFormData
      }
  },
  props: {
    msg: String
  },
  methods : {
      onSubmit(event){
          event.preventDefault();
          this.validateForm();
          console.log("Form submit hit");
      },
      validateForm(){

          this.inputForm.stock_info_fields.forEach(field => {
              this.validateByID(field);
          });
          this.inputForm.moving_average_param_fields.forEach(field => {
              this.validateByID(field);
          });

          this.validateDateRange(this.inputForm.stock_info_fields[1], this.inputForm.stock_info_fields[2]);

          for(let i = 0; i < this.inputForm.stock_info_fields.length; i++){
              if(this.inputForm.stock_info_fields[i].validationError){
                  console.log("Error found in " + this.inputForm.stock_info_fields[i].id);
                  return;
              }
          }
          for(let i = 0; i < this.inputForm.moving_average_param_fields.length; i++){
              if(this.inputForm.moving_average_param_fields[i].validationError){
                  console.log("Error found in " + this.inputForm.moving_average_param_fields[i].id);
                  return;
              }
          }

          this.emitUserInputObj();
      },

      emitUserInputObj(){
          let userInputObj = {
              symbol : this.inputForm.stock_info_fields[0].answer,
              start_date : this.inputForm.stock_info_fields[1].answer,
              end_date : this.inputForm.stock_info_fields[2].answer,
              moving_avg_length : this.inputForm.moving_average_param_fields[0].answer,
              moving_avg_entry : this.inputForm.moving_average_param_fields[1].answer,
          }

          this.$emit('user-input', userInputObj);
      },

      validateByID(field){
          if(field.id === 'stock_symbol'){
              this.validateStockSymbol(field);
          }
          else if(field.id === 'algo_start_date'){
              this.validateAlgoStartDate(field);
          }
          else if(field.id === 'algo_end_date'){
              this.validateAlgoEndDate(field);
          }
          else if(field.id === 'moving_avg_length'){
              this.validateMovingAvgLength(field);
          }
          else if(field.id === 'moving_avg_entry'){
              this.validateMovingAvgEntry(field);
          }
          else{
              console.log("Invalid form field accessed");
          }
      },

      isValidated(field){
            if(field.validationError){
                return false;
            }
            else{
                return null;
            }
        },

      validateDateRange(startField, endField){
          let startYear = startField.answer.substring(0, 4);
          let startMonth = startField.answer.substring(5,7);
          let startDay = startField.answer.substring(8,10);

          let endYear = endField.answer.substring(0, 4);
          let endMonth = endField.answer.substring(5,7);
          let endDay = endField.answer.substring(8,10);

          let startDateObj = new Date(startYear, startMonth-1, startDay);
          let endDateObj = new Date(endYear, endMonth-1, endDay);

            //2k is kinda arbitrary, just any num greater than 0. Big num = bigger min range
          if(startDateObj.getTime() - endDateObj.getTime() > 2000){
              startField.validationError = true;
              endField.validationError = true;
              startField.errorMessage = "Please choose an earlier start or later end date";
              endField.errorMessage = "Please choose an earlier start or later end date";
              console.log("Date range invalid");
              return;
          }

          startField.validationError = false;
          endField.validationError = false;
          startField.errorMessage = "";
          endField.errorMessage = "";
      },

      validateStockSymbol(field){
          if(!field.answer){
              field.validationError = true;
              field.errorMessage = "Please enter a valid stock symbol such as AAPL, MSFT, or AMZN";
              console.log("Stock symbol dirty");
              return;
          }
          field.validationError = false;
          field.errorMessage = "";
      },

      validateAlgoStartDate(field){
          const dateRegEx = new RegExp('[1-2][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]');
          if(!dateRegEx.test(field.answer)){
              field.validationError = true;
              field.errorMessage = "Please enter a data in format YYYY-MM-DD";
              console.log("Start date dirty");
              return;
          }

          field.validationError = false;
          field.errorMessage = "";
      },

      validateAlgoEndDate(field){
          const dateRegEx = new RegExp('[1-2][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]');
          if(!dateRegEx.test(field.answer)){
              field.validationError = true;
              field.errorMessage = "Please enter a date in format YYYY-MM-DD";
              console.log("End date dirty");
              return;
          }
          field.validationError = false;
          field.errorMessage = "";
      },

      validateMovingAvgLength(field){
          const numRegEx = new RegExp('[0-9]+');
          if(!numRegEx.test(field.answer)){
              field.validationError = true;
              field.errorMessage = "Please enter a positive whole number";
              console.log("Moving avg length dirty");
              return;
          }

          field.validationError = false;
          field.errorMessage = "";
      },

      validateMovingAvgEntry(field){
          const floatingPointRegEx = new RegExp('([0-9]*[.])?[0-9]+');

          if(!floatingPointRegEx.test(field.answer)){
              field.validationError = true;
              field.errorMessage = "Please enter a positive floating point number";
              console.log('Moving avg entry dirty');
              return;
          }

          field.validationError = false;
          field.errorMessage = '';
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #user_input_form{
        max-width : 100%;
    }

    h1{
        font-size: 200%;
    }

    h2{
        font-size: 160%;
    }
</style>
