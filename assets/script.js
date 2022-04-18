var weatherAPI = "https://api.openweathermap.org/data/2.5/weather?q=";
var oneCallAPI = "https://api.openweathermap.org/data/2.5/onecall?";
var fiveDayAPI = "http://bulk.openweathermap.org/snapshot/hourly_14.json.gz?appid=fef1b5f97f885ac2cd91c31a7744a496"
var searchResult = $("#queryInput");
var submitBtn = $(".weatherBtn");
var forecast = $("#forecast");
var ulEl = $("#cities");
var currWeather = $("#currWeather");
var params = {
    apiKey:"&appid=fef1b5f97f885ac2cd91c31a7744a496",
    units: "&units=imperial",
};

// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
var citySearches = [];

function displayWeather(event) {
    event.preventDefault();
    if($("#querySub")) {
        var city = searchResult.val()
        fetch(weatherAPI + city + params.units + params.apiKey)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if(data.cod == 404) {
                    alert("City Not Found");
                    searchResult.val("");
                    return;
                } else if (city === "") {
                    alert("Enter a City Name");
                    return;
                } else {
                    renderCityList(data);
                    renderCurrWeather(data);
                    fiveDay(data.coord["lat"], data.coord["lon"]);
                    searchResult.val("");
                    // event listener was running event twice when button was click.  Unbinding the even so the function only runs once on click.
                    $(".cityBtn").unbind("click").click(renderSearchHistory)
                };
            })
            .catch((error) => {
                console.log(error);
                alert("City Not Found");
                return;
            });
    };
    
};

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

function renderCurrWeather (data) {
    currWeather.empty();
    // The openweathermap img for a sunny day was difficult to see with the background colors I chose for the Cureent Weather section.
    // Checking to see if the the icon ID matches the ID for Sunny day then replacing with a more visible icon from a different website.
    if(data.weather[0]["icon"] === "01d") {
        currWeather.append($(`<li><h2>${data.name} (${moment().format("L")})<a href="https://www.freeiconspng.com/img/23508" title="Image from freeiconspng.com"><img src="https://www.freeiconspng.com/uploads/sunny-icon-2.png" width="100" alt="Sunny Ico Download" /></a></h2></li>`));
    } else {
        currWeather.append($(`<li><h2>${data.name} (${moment().format("L")})<img src="https://openweathermap.org/img/wn/${data.weather[0]["icon"]}@2x.png"></h2></li>`));
    }
    currWeather.append($(`<li>Temp: ${Math.round(data.main["temp"])}°F</li>`));
    currWeather.append($(`<li>Wind: ${Math.round(data.wind["speed"])} MPH</li>`));
    currWeather.append($(`<li>Humidity: ${data.main["humidity"]}%</li>`));
    getUV(data.coord["lat"], data.coord["lon"]);
};

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

function getUV(lat, lon) {
    fetch(oneCallAPI+ "lat=" + lat + "&lon=" + lon + params.apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
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
            };
        })
        .catch((error) => {
            console.log(error);
            alert("wrong input");
            return;
        });
};

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

// call the One Call API using the Lon and Lat from the Current Day API to get five day forecast
function fiveDay(lat, lon) {
    forecast.empty();
    fetch(oneCallAPI+ "lat=" + lat + "&lon=" + lon + params.units + params.apiKey)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {     
            for(var i = 0; i < 5; i++) {
                // *See renderCurrWeather function on the reason for checking and changing the sunny day icon
                if(data.daily[i].weather[0]["icon"] === "01d") {
                    forecast.append($(`<div><ul class="fiveDay"><li>${moment().add(i+1, "day").format("L")}</li><li><a href="https://www.freeiconspng.com/img/23508" title="Image from freeiconspng.com"><img src="https://www.freeiconspng.com/uploads/sunny-icon-2.png" width="100" alt="Sunny Ico Download" /></a></li><li>Temp: ${Math.round(data.daily[i]["temp"]["day"])}°F</li><li>Wind: ${Math.round(data.daily[i].wind_speed)} MPH</li><li>Humidity: ${data.daily[i].humidity}%</li></ul></div>`));
                } else {
                    forecast.append($(`<div><ul class="fiveDay"><li>${moment().add(i+1, "day").format("L")}</li><li><img src="https://openweathermap.org/img/wn/${data.daily[i].weather[0]["icon"]}@2x.png"></li><li>Temp: ${Math.round(data.daily[i]["temp"]["day"])}°F</li><li>Wind: ${Math.round(data.daily[i].wind_speed)} MPH</li><li>Humidity: ${data.daily[i].humidity}%</li></ul></div>`)); 
                }
            }      
        });
};

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// loop through results array to append list items of the last 8 search results, in descending order starting with most recent search
// each new result is spliced into the array at the beginning, moving the index position of all previous results up by 1
function renderCityList(data) {
    if(citySearches.indexOf(data.name) === -1) {
        citySearches.splice(0, 0, data.name)
        $("#cities").empty();
        if(citySearches.length < 8) {
            for(var i = 0; i<citySearches.length; i++) {
                ulEl.append($(`<li><button type='submit' class='weatherBtn cityBtn'>${citySearches[i]}</button></li>`));
            };
        } else {
            for(var i = 0; i<8; i++) {
                ulEl.append($(`<li><button type='submit' class='weatherBtn cityBtn'>${citySearches[i]}</button></li>`));
            };
        };
    };
};

// display current weather data by clicking on button in the search history
function renderSearchHistory(event) {
    event.preventDefault();
    var city = event.target.innerText;
    fetch(weatherAPI + city + params.units + params.apiKey)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                renderCurrWeather(data);
                fiveDay(data.coord["lat"], data.coord["lon"]);
            });
};

submitBtn.on("click", displayWeather);