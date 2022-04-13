var weatherAPI = "https://api.openweathermap.org/data/2.5/weather?q=";
var uvAPI = "https://api.openweathermap.org/data/2.5/onecall?";
var fiveDayAPI = "http://bulk.openweathermap.org/snapshot/hourly_14.json.gz?appid=fef1b5f97f885ac2cd91c31a7744a496"
// var weatherCodeImg = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
var APIKey = "fef1b5f97f885ac2cd91c31a7744a496";
var geoCodeAPI = "AIzaSyBG2mswChpByVpFe8GRN2L6_yZrV_U5Y00";
// var city = "philadelphia"
var currDate = moment().format("L");
// var weatherAPI = "https://api.openweathermap.org/data/2.5/weather?lat=39.93&lon=-75.18&appid=fef1b5f97f885ac2cd91c31a7744a496"
// var oneCallAPI = "https://api.openweathermap.org/data/2.5/onecall?lat=39.93&lon=-75.18&appid=fef1b5f97f885ac2cd91c31a7744a496"
var searchResult = $("#queryInput");
var submitBtn = $("#querySub");
var fiveDay = $("#fiveDay");

var ulEl = $("#cities");
var liCreate = $('<li class="city-list"></li>');
var liEl = $(".city-list");
var anchCreate = $('<a class="city-link">');
var anchEl = $(".city-link");
var btnCreate = $('<button type="submit" class="cityBtn"></button>');
var cityBtn = $(".cityBtn");
var currWeather = $("#currWeather");

var params = {
    apiKey:"&appid=fef1b5f97f885ac2cd91c31a7744a496",
    units: "&units=imperial",
    lat: "",
    lon: "",

};

// var cityURL = weatherAPI + city + params.units + params.apiKey
// const params = {
//     lat: "39.90809",
//     lon: "-75.32558",
//     appid: APIKey,
// }

// const options = {
//     method: 'GET',
//     body: JSON.stringify(params)  
// };

// fetch( weatherAPI, options )
//     .then( response => response.json() )
//     .then( response => {
//         console.log(response)
//     } );

// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city


// Geocoding
// https://stackoverflow.com/questions/5585957/get-latlng-from-zip-code-google-maps-api
var citySearches = [];




function test(event) {
    event.preventDefault();
    var city = searchResult.val()
    fetch(weatherAPI + city + params.units + params.apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            params.lat = data.coord["lat"];
            params.lon = data.coord["lon"];
            console.log(data);
            console.log(data.name);
            // console.log(data.main);
            console.log(data.weather[0]["icon"]);
            console.log(data.wind);
            console.log(data.coord);
            console.log(JSON.stringify(data))
            
            citySearches.splice(0, 0, city)
            localStorage.setItem("cityHistory", JSON.stringify(citySearches))
            renderCityList(data);
            renderCurrWeather(data);
        })
        .catch((error) => {
            console.log(error);
            alert("city not found");
            return;
        });
}


// store city names and links in localStorage




// loop through results array to append list items of the last 8 search results.  
// each new result is spliced into the array at the beginning, moving the index position of all previous results up by 1

// lastFiveResults.each(function(index) {
//     if(index < 5) {
//         lastFiveResults.splice(0,0, index+1)
//     }
// })

function getUV(lat, lon) {
    fetch(uvAPI + "lat=" + lat + "&lon=" + lon + params.apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data.current["uvi"]);
            if(data.current["uvi"] < 3) {
                currWeather.append($(`<li>UV Index: <span id="uvLow">${data.current["uvi"]}</span></li>`));
            } else if(data.current["uvi"] < 6) {
                currWeather.append($(`<li>UV Index: <span id="uvMod">${data.current["uvi"]}</span></li>`));
            } else if(data.current["uvi"] < 8) {
                currWeather.append($(`<li>UV Index: <span id="uvHigh">${data.current["uvi"]}</span></li>`));
            } else if(data.current["uvi"] < 11) {
                currWeather.append($(`<li>UV Index: <span id="uvVerHigh">${data.current["uvi"]}</span></li>`));
            } else {
                currWeather.append($(`<li>UV Index: <span id="uvExtr">${data.current["uvi"]}</span></li>`));
            }
            
        })
        .catch((error) => {
            console.log(error);
            alert("wrong input");
            return;
        });
}

function GetLastEight(){
    for(var i = 0; i < 8; i++) {

        citySearches.splice(0,0, i+1)
        // output +> [8, 7, 6, 5, 4, 3, 2, 1]
    }
}

// create city list

function renderCurrWeather (data) {
    currWeather.empty();
    currWeather.append($(`<li><h2>${data.name} ${moment().format("L")}<img src="https://openweathermap.org/img/wn/${data.weather[0]["icon"]}@2x.png"</h2></li>`));
    currWeather.append($(`<li>Temp: ${Math.round(data.main["temp"])}°F</li>`));
    currWeather.append($(`<li>Wind: ${Math.round(data.wind["speed"])} MPH</li>`));
    currWeather.append($(`<li>Humidity: ${data.main["humidity"]}%</li>`));
    getUV(data.coord["lat"], data.coord["lon"])
    
}

function fiveDay(event) {
    event.preventDefault();
    // var city = searchResult.val()
    fetch(uvAPI + "lat=" + params.lat + "&lon=" + params.lon + params.apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data)
        })
        .catch((error) => {
            console.log(error);
            alert("city not found");
            return;
        });
}

function renderCityList(data) {
    // var city = searchResult.val();

    // ulEl.append($(`<li><button type='submit'><a href='${weatherAPI + city + params.units + params.apiKey}'>${data.name}</button></li>`))
    // ulEl.append($(`<li><button type='submit' class='cityBtn'><a href='javascript:test(event)'>${data.name}</button></li>`))
    ulEl.append($(`<li><button type='submit' class='cityBtn'>${data.name}</button></li>`))

    // $(".cityBtn").on("click", {

    // }) 

}

function renderHistoryData(event) {
    event.preventDefault();
    // var btn = event.target;
    console.log("test");
    // fetch(weatherAPI + city + params.units + params.apiKey)
    //     .then(function (response) {
    //         return response.json();
    //     })
    //     .then(function (data) {
    //         console.log(data);
    //         console.log(data.name);
    //         // console.log(data.main);
    //         console.log(data.weather[0]["icon"]);
    //         console.log(data.wind);
    //         console.log(data.coord);
    //         console.log(JSON.stringify(data))
    //         localStorage.setItem(city, JSON.stringify(data))
    //         citySearches.splice(0, 0, city)
    //         renderCityList(data);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //         alert("city not found");
    //         return;
    //     });
}

// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&units=imperial&appid={API key}


// $.ajax({
//     url: weatherAPI,
//     method: 'GET',
//   }).then(function (response) {
//     console.log('Ajax Reponse \n-------------');
//     console.log(response);
//   });

// test()

// submitBtn.on("click", function(event){
//     event.preventDefault();
//     subBtn = event.target;
//     console.log(subBtn);

//     console.log(searchResult.val());
// })


submitBtn.on("click", test)
cityBtn.on("click", renderHistoryData)
// $(".cityBtn").on("click", renderHistoryData)