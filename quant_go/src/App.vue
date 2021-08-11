<template>
<!-- Author: Neil Kelly
NetID: nk220 -->
  <div id="app">
    <div>
      <b-navbar togglable = 'lg' type = 'dark' variant = 'dark'>
        <b-navbar-brand @click = "navToPage('home')">QuantGo</b-navbar-brand>
        <b-navbar-nav>
          <b-nav-item @click = "navToPage('intro')">Algotrading</b-nav-item>
          <b-nav-item @click = "navToPage('about')">Tutorial</b-nav-item>
          <b-nav-item @click = "navToPage('algorithm')">My Algorithm</b-nav-item>
        </b-navbar-nav>
      </b-navbar>
    </div>

    <div v-if = "this.currentPage === 'home'">
      <HomePage id = 'home-page' @next-page = 'navToPage'/>
    </div>
    <div v-else-if = "this.currentPage === 'intro'">
      <IntroPage id = 'intro-page' @next-page = 'navToPage'/>
    </div>
    <div v-else-if = "this.currentPage === 'about'">
      <AboutPage id = 'about-page' @next-page = 'navToPage'/>
    </div>
    <div v-else-if = "this.currentPage === 'algorithm'">
      <b-container>
        <b-row id = 'input-result-row'>
          <b-col cols = '6'>
            <InputForm id = 'input-form' @user-input = 'onUserInput'/>
          </b-col>
          <b-col>
            
            <Results id = 'results' :results = 'this.algoResults' />
            
          </b-col>
        </b-row>
        <hr>
        <Algorithm 
          id = 'algorithm' 
          :data = 'this.requestedData' 
          :param = 'this.userParameters'
          @algo-results = 'passResults'/>
      </b-container>
    </div>    
  </div>
</template>

<script>
import InputForm from './components/InputForm.vue'
import Algorithm from './components/Algorithm.vue'
import Results from './components/Results'
import HomePage from './components/Home.vue'
import IntroPage from './components/Intro.vue'
import AboutPage from './components/About.vue'

export default {
  name: 'App',

  data(){
    return {
      useRemoteServer : true,

      //contains one of the following values
      //home, intro, about, algorithm
      currentPage : 'home',


      //data from TwelveData API, filtered by backend
      requestedData : [],

      //contains things user enters in form
      userParameters : {},

      //trades executed after algo is run, and final price
      algoResults : {}
    }
  },
  components: {
    InputForm,
    Algorithm,
    HomePage,
    AboutPage,
    IntroPage,
    Results
  },
  
  methods: {

    navToPage(pageName){
      this.currentPage = pageName;
    },

    onUserInput(userInput){
      console.log('user input caught: ');
      console.log(userInput);
      
      const filteredParams = this.filterBackendRequestParams(userInput);
      this.backendDataRequest(filteredParams);

      this.userParameters = userInput;
    },

    //prepare to send data from Algorithm to other components
    passResults(algoResults){
      this.algoResults = algoResults;
    },

    //reduce all user inputted paramters to only ones needed for backend request
    filterBackendRequestParams(userInput){
      let params = {
        symbol : userInput.symbol,
        start_date : userInput.start_date,
        end_date : userInput.end_date
      };

      return params;

    },

    async backendDataRequest(params){
      const SERVER_URL = this.useRemoteServer ? "https://powerful-scrubland-59376.herokuapp.com/" : "";
      const url = `${SERVER_URL}api/get_data?symbol=${params.symbol}&start_date=${params.start_date}&end_date=${params.end_date}`;

      const response = await fetch(url);
      const serverData = await response.json();
      console.log("response = ");
      console.log(serverData);
      if(response.ok && serverData){
        console.log("Backedn data requested");
        this.requestedData = serverData;
      }
    },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}

#input-form{
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  font-size: 15px;
  
  float: left;
}

#results{
  height: 100%;
  position: absolute;
  text-align: left;
  padding: 4%;
  font-size: 140%;
  float: right;
}
</style>
