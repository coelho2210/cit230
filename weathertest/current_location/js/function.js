
'use strict';

function buildWC(SPEED, TEMP) {
    const realFeelTemp = document.getElementById('realFeelTemp');
    // compute windchill
    let wc = 35.74 + (0.6215 * TEMP) - (35.75 * Math.pow(SPEED, 0.16)) + (0.4275 * TEMP * Math.pow(SPEED, 0.16));
    console.log(wc);
    // round the number down
    wc = Math.floor(wc);
    // If chill is greater than temp, return the temp
    wc = (wc > TEMP) ? TEMP : wc;
    console.log(wc);
    wc = 'Feels like ' + wc + '&#176;F';
    realFeelTemp.innerHTML = wc;
}

function getCondition(CONDITION) {
    let cond = CONDITION.toLowerCase();
    // set newCond to clear
    if (cond.includes('sunny') || cond.includes('clear')) {
        console.log('clear');
        newCond = 'clear';
        console.log('getCondition: ' + newCond);
    }
    // set newCond to cloudy
    if (cond.includes('cloud') || cond.includes('overcast')) {
        console.log('cloudy');
        newCond = 'cloudy';
    }
    // set newCond to fog
    if (cond.includes('fog') || cond.includes('mist')) {
        console.log('fog');
        newCond = 'fog';
    }
    // set newCond to rain
    if (cond.includes('rain') || cond.includes('shower')) {
        console.log('rain');
        newCond = 'rain';
    }
    // set newCond to snow
    if (cond.includes('snow') || cond.includes('flurr')) {
        console.log('snow');
        newCond = 'snow';
    }
}

function changeSummaryImage(newCond) {
    let picture = document.getElementById('sections');
    console.log(picture);
    // add class to put in correct picture
    picture.classList.add(newCond);
}

function rotateWindPointer(DIRECTION) {
    let windPointer = document.getElementById('windPointerImg');
    console.log(windPointer);
    let dir = DIRECTION.toLowerCase();
    // if statements to add correct class to rotate the wind dial
    if (dir.includes('ne') || dir.includes('north east')) {
        windPointer.classList.add('rotateNE');
        console.log('rotate NE');
    }
    if (dir == 'e' || dir == 'ease') {
        windPointer.classList.add('rotateE');
        console.log('rotate E');
    }
    if (dir.includes('se') || dir.includes('south east')) {
        windPointer.classList.add('rotateSE');
        console.log('rotate SE');
    }
    if (dir == 's' || dir.includes('south')) {
        windPointer.classList.add('rotateS');
        console.log('rotate S');
    }
    if (dir.includes('sw') || dir.includes('south west')) {
        windPointer.classList.add('rotateSW');
        console.log('rotate SW');
    }
    if (dir == 'w' || dir.includes('west')) {
        windPointer.classList.add('rotateW');
        console.log('rotate W');
    }
    if (dir.includes('nw') || dir.includes('north west')) {
        windPointer.classList.add('rotateNW');
        console.log('rotate NW');
    }
}


function getCode(LOCALE) {
    //const API_KEY = 'P51AQbUriOlYdji9xUai8n1GEAV1enQN'; // personal  key
    const API_KEY = 'El04tPqxZWYwLw0RLbBCejOs9553Vqxt'; // personal  key 2

    const URL = 'https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=' + API_KEY + '&q=' + LOCALE;
    fetch(URL)
        .then(response => response.json())
        .then(function (data) {
            console.log('Json object from getCode function:');
            console.log(data);
            const locData = {}; // Create an empty object
            locData['key'] = data.Key; // Add the value to the object
            locData['name'] = data.LocalizedName;
            locData['postal'] = data.PrimaryPostalCode;
            locData['state'] = data.AdministrativeArea.LocalizedName;
            locData['stateAbbr'] = data.AdministrativeArea.ID;
            locData['geoposition'] = LOCALE;
            locData['elevation'] = data.GeoPosition.Elevation.Imperial.Value;
            getWeather(locData);
        })
        .catch(error => console.log('There was a getCode error: ', error))
} // end getCode function

// Get Current Weather data from API
function getWeather(locData) {
    //const API_KEY = 'P51AQbUriOlYdji9xUai8n1GEAV1enQN'; // personal  key
    const API_KEY = 'El04tPqxZWYwLw0RLbBCejOs9553Vqxt'; // personal key 2
    
    const CITY_CODE = locData['key']; // We're getting data out of the object
    const URL = "https://dataservice.accuweather.com/currentconditions/v1/" + CITY_CODE + "?apikey=" + API_KEY + "&details=true";
    fetch(URL)
        .then(response => response.json())
        .then(function (data) {
            console.log('Json object from getWeather function:');
            console.log(data); // Let's see what we got back
            // Start collecting data and storing it
            locData['currentTemp'] = data[0].Temperature.Imperial.Value;
            locData['summary'] = data[0].WeatherText;
            locData['windSpeed'] = data[0].Wind.Speed.Imperial.Value;
            locData['windUnit'] = data[0].Wind.Speed.Imperial.Unit;
            locData['windDirection'] = data[0].Wind.Direction.Localized;
            locData['windGust'] = data[0].WindGust.Speed.Imperial.Value;
            locData['pastLow'] = data[0].TemperatureSummary.Past12HourRange.Minimum.Imperial.Value;
            locData['pastHigh'] = data[0].TemperatureSummary.Past12HourRange.Maximum.Imperial.Value;
            getHourly(locData); // Send data to getHourly function
        })
        .catch(error => console.log('There was an error: ', error))
} // end getWeather function

// Get next 12 hours of forecast data from API
function getHourly(locData) {
    //const API_KEY = 'P51AQbUriOlYdji9xUai8n1GEAV1enQN'; // personal  key
    const API_KEY = 'El04tPqxZWYwLw0RLbBCejOs9553Vqxt'; // personal 2 
    const CITY_CODE = locData['key'];
    const URL = "https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/" + CITY_CODE + "?apikey=" + API_KEY;
    fetch(URL)
        .then(response => response.json())
        .then(function (data) {
            console.log('Json object from getHourly function:');
            console.log(data); // See what we got back
            // Get the first hour in the returned data
            let date_obj = new Date(data[0].DateTime);
            let nextHour = date_obj.getHours(); // returns 0 to 23
            // Store into the object
            locData["nextHour"] = nextHour;
            // Counter for the forecast hourly temps
            var i = 1;
            // Get the temps for the next 12 hours
            data.forEach(function (element) {
                let temp = element.Temperature.Value;
                let hour = 'hourTemp' + i;
                locData[hour] = temp; // Store hour and temp to object
                // New hiTemp variable, assign value from previous 12 hours
                let hiTemp = locData.pastHigh;
                // New lowTemp variable, assign value from previous 12 hours
                let lowTemp = locData.pastLow;
                // Check current forecast temp to see if it is 
                // higher or lower than previous hi or low
                if (temp > hiTemp) {
                    hiTemp = temp;
                } else if (temp < lowTemp) {
                    lowTemp = temp;
                }
                // Replace stored low hi and low temps if they changed
                if (hiTemp != locData.pastHigh) {
                    locData["pastHigh"] = hiTemp; // When done, this is today's high temp
                }
                if (lowTemp != locData.pastLow) {
                    locData["pastLow"] = lowTemp; // When done, this is today's low temp
                }
                i++; // Increase the counter by 1
            }); // ends the foreach method
            console.log('Finished locData object and data:');
            console.log(locData);
            buildPage(locData); // Send data to buildPage function
        })
        .catch(error => console.log('There was an error: ', error))
} // end getHourly function

// variable is reassigned it getCondition() and passed to changeSummaryImage()
let newCond;

// build page function
function buildPage(locData) {
    // Task 1 - Feed data to WC, Dial and Image functions

    // variables for current weather page
    const TEMP = locData.currentTemp;
    const SPEED = locData.windSpeed;
    // variables for getCondition and changeSummaryImage function
    const CONDITION = locData.summary;
    console.log(CONDITION);
    // let newCond;
    // wind pointer variable
    let DIRECTION = locData.windDirection;

    // FUNCTION CALLS
    buildWC(SPEED, TEMP);
    getCondition(CONDITION);
    console.log(newCond);
    changeSummaryImage(newCond);
    rotateWindPointer(DIRECTION);
    buildHourly(locData);
    // Task 2 - Populate location information
    document.getElementById('zip').innerHTML = "<strong>Zip: </strong>" + locData.postal + " "
    document.getElementById('elevation').innerHTML = "<strong>Evelation: </strong>" + locData.elevation + " ft. ";
    document.getElementById('location').innerHTML = "<strong>Location: </strong>" + locData.geoposition + " ";
    document.getElementById('name').innerHTML = locData.name + ", " + locData.stateAbbr;

    // Task 3 - Populate weather information
    document.getElementById('real-temp').innerHTML = TEMP + "&#176;F";
    document.getElementById('wind-speed').innerHTML = SPEED + " mph";
    document.getElementById('wind-direction').innerHTML = "<strong>Direction: </strong>" + locData.windDirection;
    document.getElementById('wind-gusts').innerHTML = "<strong>Gusts: </strong>" + locData.windGust + " mph";
    document.getElementById('high-temp').innerHTML = locData.pastHigh + "&#176;F";
    document.getElementById('low-temp').innerHTML = locData.pastLow + "&#176;F";
    document.getElementById('DailyCond').innerHTML = newCond;

    // Task 4 - Hide status and show main
    document.getElementById('main').addEventListener('load', changeHiddenClass());
    function changeHiddenClass() {
        document.getElementById('status').classList.add('hidden');
        document.getElementById('main').classList.remove('hidden');
    }
}

// formats a value into a 12h AM/PM time string
function format_time(hour) {
    if (hour > 23) {
       hour -= 24;
    }
    let amPM = (hour > 11) ? "pm" : "am";
    if (hour > 12) {
       hour -= 12;
    } else if (hour == 0) {
       hour = "12";
    }
    return hour + amPM;
 } // end format_time function
 
 function buildHourly(locData) {
    //const hourlyTime = document.getElementById("forecast").children[1];
    const hourlyTime = document.createElement("ul");
    console.log(hourlyTime);
 
    const currentHour = new Date().getHours();
    console.log(currentHour);
 
    for (let i = 0; i < 12; i++) {
       const newHour = document.createElement('li');
       newHour.innerHTML = `${format_time(currentHour - i)}: ${locData["hourTemp" + (i + 1)]}&deg;F`;
       hourlyTime.appendChild(newHour);
    }
    console.log(hourlyTime);
    const forecast = document.getElementById("hourly-forecast");
    forecast.replaceChild(hourlyTime, forecast.children[1]);
 }

