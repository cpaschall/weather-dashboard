var weatherAPI = "https://api.openweathermap.org/data/2.5/weather?q=";
var uvAPI = "https://api.openweathermap.org/data/2.5/onecall?";
var fiveDayAPI = "http://bulk.openweathermap.org/snapshot/hourly_14.json.gz?appid=fef1b5f97f885ac2cd91c31a7744a496"
var APIKey = "fef1b5f97f885ac2cd91c31a7744a496";
var geoCodeAPI = "AIzaSyBG2mswChpByVpFe8GRN2L6_yZrV_U5Y00";
var currDate = moment().format("L");
var searchResult = $("#queryInput");
var submitBtn = $(".weatherBtn");
var forecast = $("#forecast");
var ulEl = $("#cities");
var liCreate = $('<li class="city-list"></li>');
var liEl = $(".city-list");
var anchCreate = $('<a class="city-link">');
var anchEl = $(".city-link");
var btnCreate = $('<button type="submit" class="weatherBtn"></button>');
var currWeather = $("#currWeather");

var params = {
    apiKey:"&appid=fef1b5f97f885ac2cd91c31a7744a496",
    units: "&units=imperial",
};

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

var citySearches = [];

function test(event) {
    event.preventDefault();
    console.log(event.target);
    if ($(".cityBtn")) {
        console.log("city btn")
    }
    if($("#querySub")) {
        console.log("you hit the search btn")
    
        var city = searchResult.val()
        fetch(weatherAPI + city + params.units + params.apiKey)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if(data.cod == 404) {
                    alert("City Not Found");
                    return;
                } else {
                    console.log(data.cod);   
                        
                    // localStorage.setItem("cityHistory", JSON.stringify(citySearches))
                    renderCityList(data);
                    renderCurrWeather(data);
                    fiveDay(data.coord["lat"], data.coord["lon"]);
                    // event listener was running event twice when button was click.  Unbinding the even so the function only runs once on click.
                    $(".cityBtn").unbind("click").click(renderSearchHistory)
                    console.log(citySearches)  
                }
            })
            .catch((error) => {
                console.log(error);
                alert("city not found");
                return;
            });
    };
    
}


// store city names and links in localStorage

// loop through results array to append list items of the last 8 search results.  
// each new result is spliced into the array at the beginning, moving the index position of all previous results up by 1

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

// function getLastEight(){
//     for(var i = 0; i < 8; i++) {

//         citySearches.splice(0,0, i+1)
//         // output +> [8, 7, 6, 5, 4, 3, 2, 1]
//     }
// }

// create city list

function renderCurrWeather (data) {
    currWeather.empty();
    currWeather.append($(`<li><h2>${data.name} ${moment().format("L")}<img src="https://openweathermap.org/img/wn/${data.weather[0]["icon"]}@2x.png"></h2></li>`));
    currWeather.append($(`<li>Temp: ${Math.round(data.main["temp"])}°F</li>`));
    currWeather.append($(`<li>Wind: ${Math.round(data.wind["speed"])} MPH</li>`));
    currWeather.append($(`<li>Humidity: ${data.main["humidity"]}%</li>`));
    getUV(data.coord["lat"], data.coord["lon"])
}

// call the One Call API using the Lon and Lat from the Current Day API to get five day forecast
function fiveDay(lat, lon) {
    forecast.empty();
    fetch(uvAPI + "lat=" + lat + "&lon=" + lon + params.units + params.apiKey)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data.daily[0]);            
            for(var i = 0; i < 5; i++)
                forecast.append($(`<div><ul><li>${moment().add(i+1, "day").format("L")}</li><li><img src="https://openweathermap.org/img/wn/${data.daily[i].weather[0]["icon"]}@2x.png"></li><li>Temp: ${Math.round(data.daily[i]["temp"]["day"])}°F</li><li>Wind: ${data.daily[i].wind_speed} MPH</li><li>Humidity: ${data.daily[i].humidity}%</li></ul></div>`));       
        })
}

function renderCityList(data) {
    if(data.cod !== 404) {
        if(citySearches.indexOf(data.name) === -1) {
            citySearches.splice(0, 0, data.name)
            ulEl.append($(`<li><button type='submit' class='weatherBtn cityBtn'>${data.name}</button></li>`));
        };
        // ulEl.append($(`<li><button type='submit' class='weatherBtn cityBtn'>${data.name}</button></li>`));
    }
    
    // id='${data.coord.id}
}


// display current weather data by clicking on button in the search history
function renderSearchHistory(event) {
    event.preventDefault();
    var city = event.target.innerText;
    console.log(event)
    fetch(weatherAPI + city + params.units + params.apiKey)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                renderCurrWeather(data);
                // forecast.empty();
                fiveDay(data.coord["lat"], data.coord["lon"]);
            })
}

submitBtn.on("click", test)