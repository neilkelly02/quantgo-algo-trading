<template>
<!-- Author: Neil Kelly
NetID: nk220 -->
  <div id="home-page">
    <div id = "top-text">
        <h1 id = "title">{{this.content.title}}</h1>
        <h3 id = "subtitle">{{this.content.subtitle}}</h3>
    </div>
    
    <b-button 
        id = 'button-next-page'
        variant = 'outline-dark'
        @click = 'nextPage()'>{{this.content.bottom_text}}</b-button>
    <br>
  </div>
</template>

<script>

    export default{
        name: 'Home',
        components: {
    },
        data(){
            return {
                content : {
                    title : 'Welcome to QuantGo',
                    subtitle : "the world's simplest introduction to algorithmic trading",
                    bottom_text : "Let's Get Started"
                }
            }
        },

        methods : {
            nextPage(){
                console.log('next page');
                this.$emit('next-page', 'intro');
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #home-page{
        width:100%;
        height:100vh;
        text-align: center;

        background-image: url('../../../assets/home_background.png');
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: 100% 100%;
    }

    #top-text{
        padding: 5%;
        text-align: left;
    }

    #title{
        font-size: 240%;
    }

    #subtitle{
        font-size: 110%;
    }

    #button-next-page{
        width: 30%;
        height: 13%;
        font-size: 200%;
        margin: 3%;
        margin-left: 10%;
        margin-bottom: 10%;
        position: fixed;
        bottom: 0;
    }

    #down-next-page{
        width: 10%;
        height: 10%;

    }
</style>
