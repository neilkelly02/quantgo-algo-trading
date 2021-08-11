<template>
<!-- Author: Neil Kelly
NetID: nk220 -->
  <div id="results-pane">
    <h3>{{this.content.title}}</h3>
    <div v-if = 'this.results === {}'></div>
    <div v-else>
        <div class = 'results-text'>
            Currently, you hold {{this.totalShares}} shares worth ${{this.totalValue}}.
        </div>
        <br>
        <div class = 'results-text'>
            Over the course of the algorithm, you spent ${{this.totalSpent}} purchasing shares.
        </div>
        <br>
        <div class = 'results-text'>
            This nets you a {{this.percentageProfit}}% profit.
        </div>
        <br>
        <hr>
        <br>
        <div class = 'results-text'>If you held your money without trading, you would have ${{this.totalValueHolding}}</div>
        <br>
        <div v-if = 'this.beatMarket' class = 'results-text'>Congratulations! Your algorithm beat the market!</div>
        <div v-else class = 'results-text'>Unfortunately, your algorithm did not beat the market. Try adjusting some parameters, or picking a different time period!</div>
    </div>
  </div>
</template>

<script>

    export default{
        name: 'Results',

        data(){
            return {
                firstLoad : true,
                content : {
                    title : 'Results'
                }
            }
        },

        props : {
            results : {}
        },

        computed : {
            totalValue : function(){
                let totalValue = 0;
                this.results.currPositions.forEach(pos => {
                    totalValue += pos.sharesPurchased * this.results.finalPrice;
                });
                return totalValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },

            totalShares : function(){
                let totalShares = 0;
                this.results.currPositions.forEach(pos => {
                    totalShares += pos.sharesPurchased;
                });

                return totalShares.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },

            totalSpent : function(){
                return (this.results.currPositions.length * 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },

            percentageProfit : function(){
                let totalValue = 0;

                this.results.currPositions.forEach(pos => {
                    totalValue += pos.sharesPurchased * this.results.finalPrice;
                });

                let totalSpent = this.results.currPositions.length * 1000;


                let percentageProfit = 100 * (totalValue-totalSpent)/totalSpent;
                console.log("PERCENT PROFIT IS " + percentageProfit);
                return percentageProfit.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },

            totalValueHolding : function(){
                let totalInitialShares = (1000*this.results.currPositions.length) / this.results.initialPrice;
                let totalValueHolding = totalInitialShares * this.results.finalPrice;
                return totalValueHolding.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },

            beatMarket : function(){
                let totalInitialShares = (1000*this.results.currPositions.length) / this.results.initialPrice;
                let totalValueHolding = totalInitialShares * this.results.finalPrice;

                let totalValue = 0;
                this.results.currPositions.forEach(pos => {
                    totalValue += pos.sharesPurchased * this.results.finalPrice;
                });

                return totalValue > totalValueHolding;
            }
        },

        methods : {
            nextPage(){
                console.log('next page');
                this.$emit('next-page', 'intro');
            },

            calculateTotalPosition(){
                let totalValue = 0;

                this.positions.forEach(pos => {
                    totalValue += pos.sharesPurchased * this.finalPrice;
                });

                this.content.total_value = totalValue;
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #results-pane{
        outline:2px solid red;
        border: 2px solid orange;
        text-align: left;
    }

    .result-text{
        text-align: left;
        border: 2px solid green;
    }
</style>
