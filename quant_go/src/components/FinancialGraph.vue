
<script>
//Author: Neil Kelly
//NetID: nk220

// runs algorithm and displays data

    import {Line, Scatter, mixins} from 'vue-chartjs'
    const { reactiveProp } = mixins
 
    export default {
        extends: Line, Scatter,
        mixins: [reactiveProp],
        props: {
            chartData : {
                type : Object,
                default: null
            },
            options : {
                type : Object,
                default: null
            }
        },
        mounted () {
            this.renderChart(this.chartData, this.options);
        }
    }
</script>

<style>

</style>