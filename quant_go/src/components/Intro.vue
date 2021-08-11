<template>
<!-- Author: Neil Kelly
NetID: nk220 -->
  <div id="intro-page">
    <b-container
        id = 'intro-container'
        fluid>
        <b-row class = 'text-left'>
            <b-col id = 'intro-title'>
                {{this.content.title}}
            </b-col>
        </b-row>

        <b-row id = 'algo-trading-row' class = 'text-center'>
            <b-col>
                <img id = 'robot-pic' src = '../../../assets/algo_trading_1.png'>
            </b-col>

            <b-col 
                id = 'algo-trading-description' 
                cols = '6'
                align-v = 'center'>
                {{this.content.algo_trading_description_1}}
                <br>
                <br>
                <i>{{this.content.algo_trading_description_2}}</i>
            </b-col>
        </b-row>
        <hr>
        <b-row id = 'mean-reversion-row' class = 'text-left'>
            <b-col 
                id = 'mean-reversion-description'
                cols = '6'
                align-v = 'center'>

                <h2 id = 'mean-reversion-title'>{{this.content.mean_reversion_title}}</h2>

                {{this.content.mean_reversion_description_1}}
                <br>
                <br>
                {{this.content.mean_reversion_description_2}}
                <br>
                <br>
                {{this.content.mean_reversion_description_3}}
                <br>
                <br>
                {{this.content.mean_reversion_description_4}}
            </b-col>
            <b-col
                id = 'mean-reversion-picture'
                align-v = 'center'
                cols = '6'>
                <img id = 'normal-distribution-pic' src = '../../../assets/normal_distribution.png'>
            </b-col>
        </b-row>
        <hr>
        <b-row id = 'next-page-row' class = 'text-center'>
            <b-col
                id = 'next-page-text'
                align-v = 'center'
                cols = 4>
                When you're ready...
            </b-col>
            <b-col
                id = 'next-page'
                align-v = 'center'>
                <b-button 
                    id = 'next-page-button' 
                    variant = 'outline-dark'
                    @click = 'nextPage()'>
                    Learn How to Use QuantGo <b-icon-arrow-right></b-icon-arrow-right>
                </b-button>
            </b-col>
        </b-row>

    </b-container>

  </div>
</template>

<script>
    import { BIconArrowRight } from 'bootstrap-vue'

    export default{
        name: 'Intro',
        components : {
            BIconArrowRight
        },
        data(){
            return {
                content : {
                    title : 'So, what is algorithmic trading?',

                    algo_trading_description_1 : 
                    "Every day, billions of dollars of stocks are traded between people around the world. However, it isn't always 'people' doing the trading. Because trading requires split second, rational decisions, it's become more and more common for both institutions and individual traders to use computers to do the trading for them.",

                    algo_trading_description_2 :
                    "This is algorithmic trading.",

                    mean_reversion_title: "Mean Reversion",
                    mean_reversion_description_1 : "Stock prices can fluctuate wildly, often with no underlying change to the company itself. Mean reversion is the assumption that if a stock price changes dramatically in the short term, it will probably return to a more normal price afterwards. That is, it will revert to the mean.",
                    mean_reversion_description_2 : "For example, if a stock drops suddenly, according to a mean reversion, this is a good time to buy, because the price will probably go back up in the near future.",
                    mean_reversion_description_3 : "We can define 'drop suddenly' using some simple statistics. By keeping track of a moving average, we can decide to buy when the price drops below a certain number of standard deviations from the mean of this moving average.",
                    mean_reversion_description_4 : "QuantGo allows you to easily define and test your own mean reversion algorithm."
                }
            }
        },

        methods : {
            nextPage(){
                this.$emit('next-page', 'about');
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    #intro-page{
        text-align: center;
    }

    #intro-title{
        max-width : 80%;
        font-size : 300%;
        margin: 2%;
    }

    #robot-pic{
        max-width: 100%;
    }

    #algo-trading-row{
        margin-top: 2%;
        margin-bottom: 2%;
    }

    #algo-trading-description{
        font-size: 130%;

        text-align: left;

        display: flex;
        justify-content: center;
        align-content: center;
        flex-direction: column;
    }

    #mean-reversion-row{
        margin-top: 2%;
        margin-bottom: 2%;
    }

    #mean-reversion-description{
        font-size: 120%;
        padding: 2%;
    }

    #mean-reversion-title{
        text-align: center;
    }

    #normal-distribution-pic{
        max-width: 100%;
    }

    #next-page-row{
        height: 15vh;
        
    }

    #next-page-text{
        display: flex;
        justify-content: center;
        align-content: center;
        flex-direction: column;
        font-size: 200%;
    }

    #next-page-button{
        height: 140%;
        font-size: 130%;
    }

    #next-page{
        display: flex;
        justify-content: center;
        align-content: center;
        flex-direction: column;

        margin: 2%; 
    }
</style>
