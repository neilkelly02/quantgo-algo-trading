<template>
<!-- Author: Neil Kelly
NetID: nk220 -->
  <div id="about-page">
    <div class="accordion" role="tablist">

    <div id = 'tutorial-title'>
        {{this.content.title}}
    </div>

    <b-card v-for = '(step, i) in this.content.steps' :key= 'i+step.step_title' no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle = "'accordion-' + i" variant="dark">
            {{step.step_num + step.step_title}}
        </b-button>
      </b-card-header>
      <b-collapse :id="'accordion-' + i" accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <b-card-text class = 'step-description-tip'>
              {{ step.step_description }}
              <br><br>
              <i>Tip: {{step.step_tip}}</i>
          </b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-button
        variant = 'outline-dark'
        id = 'next-page-button'
        @click = 'nextPage()'
    >
        Enough Reading. Try It Out Yourself! <b-icon-arrow-right></b-icon-arrow-right>
    </b-button>
  </div>
  </div>
</template>

<script>
    import { BIconArrowRight } from 'bootstrap-vue'

    export default{
        name: 'About',
        components : {         
            BIconArrowRight,
        },
        data(){
            return {
                content : {
                    steps : [
                        {
                            step_num : 'Step One: ',
                            step_title : 'Pick a Stock',
                            step_description : 'Choose a stock of a publicly traded company. Make sure you know the ticker symbol. For example, the ticker symbol for Apple is AAPL. The ticker symbol for Microsoft is MSFT.',
                            step_tip : 'Large, well known companies will have more available data, and thus will yield more accurate results.',
                        },
                        {
                            step_num : 'Step Two: ',
                            step_title : 'Pick a Time Frame',
                            step_description : "You'll have to pick the time range you want the algorithm to run for. It's recommended that you choose time intervals between three months and two years. Any shorter and you won't have enough data, any longer and the application may run slowly.",
                            step_tip : 'Experiment with picking periods of high market volatility, such as the first half of 2020.',
                        },
                        {
                            step_num : 'Step Three: ',
                            step_title : 'Define an Entry Strategy',
                            step_description : "An entry strategy is the conditions that must be met in order for your algorithm to automatically buy a stock. You'll define the length of a moving average, which is the number of previous days you use to calculate the average and standard deviation. For example, a moving average of 30 days will use the last 30 days of data. Next, you'll define how many standard deviations below the mean the price will need to be for you to purchase the stock.",
                            step_tip : 'If your algorithm is buying too early, try increasing the standard deviations below mean number. If your algorithm is missing out on some good buys, try lowering the threshhold and playing with the moving average length.',

                        },
                        {
                            step_num : 'Step Four: ',
                            step_title : 'Run the Algorithm',
                            step_description : "This part is easy! Just hit the run algorithm button! When the entry conditions are met, you will automatically purchase 1000 USD worth of the stock. Your algorithm results will be displayed on a graph, along with the stock price over time.",
                            step_tip : 'The green circles on the graph represent points where you bought the stock.'
                        },
                        {
                            step_num : 'Step Five: ',
                            step_title : 'Analyze the Results',
                            step_description : "Did you make a profit? Did you make more money than you would have if you'd just bought and held the stock? Adjust your parameters and see if you can yield better results.",
                            step_tip : 'Mean reversion works best over a short period of time when market volatility is high. Over the course of many years, buying and holding a stock usually wins out.'
                        },
                    ],
                    title : 'Tutorial: How to Use QuantGo in 5 Easy Steps',
                }
            }
        },

        methods: {
            nextPage(){
                this.$emit('next-page', 'algorithm');
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #user_input_form{
        max-width : 80%;
    }

    #tutorial-title{
        font-size: 200%;
        margin: 2%;
    }

    .step-description-tip{
        text-align: left;
    }

    #next-page-button{
        margin: 2%;
        font-size: 200%;
    }
</style>
