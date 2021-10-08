//Author: Neil Kelly
//NetID: nk220

// package for responding to requests for a specific URL
const express = require('express');
// package for logging attempts to access the server (for easier debugging)
const morgan = require('morgan');
// package that replicates fetch functionality built into the browser
const fetch = require('node-fetch');
// package that bundles up query parameters given as an Object into URL syntax
const querystring = require('querystring');
// package that allows certain URLs to access the server
const cors = require('cors');
//stringify without circular calling...or something
const stringify = require('json-stringify-safe');

//way to divide into multiple files
// const {getJSON} = require('./utilities.js');

// const utilities = require('./utilities.js');
// utilities.getJSON(fff);

const { TWELVEDATA_API } = require('./secrets');
const { SERVER_DBC } = require('./server_dbc.js');

const app = express();

//Listen to localhost:3000 or remote 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

//Logging
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

//CORS security stuff
const whitelist = [
    'https://compsci290_2021spring.dukecs.io', 
    'localhost:8080',
    'https://powerful-scrubland-59376.herokuapp.com/'];
const corsOptions = {
    origin: (origin, callback) => {
        // only allow sites listed above or dev-server proxies to access server data
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            const err = new Error('CORS Error: This site is not authorized to access this resource.');
            err.status = 401;
            callback(err);
        }
    },
};
app.use(cors(corsOptions));


//if you visit the heroku link directly
app.get('/', (req, res) => {
    res.status(200);
    res.send(`
      <p>QuantGo Server has been deployed here</p>
    `);
  });

//primary fetch expected from frontend
app.get('/api/get_data', async (req, res) => {

    const start_date = req.query.start_date;
    const end_date = req.query.end_date;

    console.assert(
        SERVER_DBC.VALID_DATE.test(start_date) || SERVER_DBC.VALID_DATE_TIME.test(start_date), 
        `Start date ${start_date} format invalid`
    );
    console.assert(
        SERVER_DBC.VALID_DATE.test(end_date) || SERVER_DBC.VALID_DATE_TIME.test(end_date), 
        `End date ${end_date} format invalid`
    );

    try{
        const priceData = await fetchPriceHistory(req.query.symbol, start_date, end_date);
        const filteredPriceData = filterPriceHistory(priceData);
        res.json(filteredPriceData);
      
    } catch(error){
      console.log(error);
      const err = new Error('Error: Check server --- invalid query or API currently unavailable.');
      // set status code to return with response
      err.status = 503;
      // forward error on to next middleware handler (the error handler defined below)
      next(err);
    }
});

async function getJSON(url, apiAction, queryParameters, protocolOptions) {
    const parameters = queryParameters ? `?${querystring.stringify(queryParameters)}` : '';
    const urlWithParameters = `${url}${apiAction}${parameters}`;
    console.log("API Called with URL: " + urlWithParameters);
    const response = await fetch(urlWithParameters, protocolOptions);
    console.log("Returned from API: " + stringify(response));
    return response.json();
}

//compiles query parameters into object
async function fetchPriceHistory(symbol, start_date, end_date){
    try {
        const parameters = {
            symbol : symbol,
            interval : await getInterval(symbol, start_date, end_date),
            format : 'JSON',
            dp : '2',
            start_date : start_date,
            end_date : end_date,
            apikey : TWELVEDATA_API.TOKEN
          }
    
          console.log("CHECKING INTERVAL: " + parameters.interval);
          const jsonData = await getJSON(TWELVEDATA_API.URL, 'time_series', parameters);
        
          //fetched proper data successfully
          if(jsonData.values){
            return jsonData;
          }
    
          throw new Error(`TwelveData API Error: ${jsonData.message}`);

    } catch (error) {
        if(error === "no data for start date"){
            
        }
    }
    
}

//include only the high for the interval
function filterPriceHistory(priceData){
    let filteredData = {
        meta : priceData.meta,
        values : []
    };

    priceData.values.forEach(val => {
        let newVal = {
            datetime : val.datetime,
            price : val.high
        };

        filteredData.values.push(newVal);
    });

    return filteredData;
}

//calculate the proper interval between data points (5min, 15min, 1hr, 1day etc.) based on duration between start and end date
//longer duration => longer interval so as not to process an overwhelming amount of data
async function getInterval(symbol, start_date, end_date){    
    try {
        const startYear = parseInt(start_date.substring(0, 4));
        const endYear = parseInt(end_date.substring(0, 4));

        const startMonth = parseInt(start_date.substring(5, 7));
        const endMonth = parseInt(end_date.substring(5, 7));

        const startDay = parseInt(start_date.substring(8, 10));
        const endDay = parseInt(end_date.substring(8, 10));

        const startDateObj = new Date(startYear, startMonth-1, startDay);
        const endDateObj = new Date(endYear, endMonth-1, endDay);

        const differenceInMinutes = (endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60);

        console.assert(
            differenceInMinutes >= 0,
            `Start date must come before end date in getInterval()`
        );

        console.assert(
            differenceInMinutes > 59,
            `Difference between start and end too small in getInterval()`
        );    
        
        let interval = "";

        if(differenceInMinutes >= 525600){ //duration over a year
            interval = "4h";
        }
        else if(differenceInMinutes >= 43800){ //duration one month - one year
            interval = "2h";
        } 
        else if(differenceInMinutes >= 10080){ //duration one week - one month
            interval = "15min";
        }
        else if(differenceInMinutes >= 1440){ //duration one day - one week
            interval = "15min";
        }

        console.assert(SERVER_DBC.VALID_INTERVALS.includes(interval));
        interval = await getShortestAvailableInterval(symbol, startDateObj, interval, SERVER_DBC.VALID_INTERVALS);
        console.log("Calculated interval: " + interval);
        return interval;
    } catch (error) {
        console.log("ERROR CAUGHT: " + error);
        if(error === "no data for start date"){
            throw error;
        }
        else{
            console.log("Unhandled error: " + error);
        }
    }
    
}

//function that returns shortest time interval with available data that is at least as long as interval param
async function getShortestAvailableInterval(symbol, startDateObj, interval, validIntervals){
    
    //specific mode
    let intervalIndex = validIntervals.indexOf(interval);
    //stops iterating at 1day interval
    for(intervalIndex; intervalIndex < 9; intervalIndex++){
        let dataIsAvailable = await dataAvailable(symbol, startDateObj, validIntervals[intervalIndex]);
        console.log("index = " + intervalIndex);
        console.log("Checking if data available for symbol: " + symbol + " for interval " + validIntervals[intervalIndex]);
        if(dataIsAvailable){
            console.log("INTERVAL FOUND!! " + validIntervals[intervalIndex]);
            return validIntervals[intervalIndex];
        }
    }

    // //low API call mode
    // used during testing to minimize API calls, defaults to 1day interval if ideal interval unavailable
    // let dataIsAvailable = await dataAvailable(symbol, startDateObj, interval);
    // if(dataIsAvailable){
    //     return interval;
    // }
    
    // dataIsAvailable = await dataAvailable(symbol, startDateObj, "1day");
    // if(dataIsAvailable){
    //     return "1day";
    // }

    //no data whatsoever for specified symbol/start
    console.log("ERROR: no data available for " + symbol + " at start date " + stringify(startDateObj));
    throw "no data for start date";
}

//helper for getShortestAvailableInterval() checks if API has data for parameters
async function dataAvailable(symbol, startDateObj, interval){
    console.assert(
        SERVER_DBC.VALID_INTERVALS.includes(interval)),
        `Invalid interval used in fetchDataAvailable(): ${interval}`;

    
    const earliestTimestampData = await fetchDataAvailable(symbol, interval);

    const earliestDateObj = new Date(earliestTimestampData.unix_time *1000);

    let res = (startDateObj.getTime() - earliestDateObj.getTime()) >= 0;

    return res;
}

//helper function for dataAvailable, calls API for earliest_timestamp
async function fetchDataAvailable(symbol, interval){
    
    parameters = {
        symbol : symbol,
        interval : interval,
        apikey : TWELVEDATA_API.TOKEN
    };

    const earliestTimestampData = await getJSON(TWELVEDATA_API.URL, 'earliest_timestamp', parameters);
    
    console.assert(earliestTimestampData.unix_time, `Unix time unavailable for ${stringify(earliestTimestampData)} in fetchDataAvailable()`);
    return earliestTimestampData;
}
