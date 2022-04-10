var weatherAPI = "https://api.openweathermap.org/data/2.5/weather?"
var APIKey = "fef1b5f97f885ac2cd91c31a7744a496"
var searchResult = $("#queryInput")
var submitBtn = $("#querySub")

const params = {
    lat: "39.90809",
    lon: "-75.32558",
    appid: APIKey,
}

const options = {
    method: 'GET',
    body: JSON.stringify(params)  
};

fetch( weatherAPI, options )
    .then( response => response.json() )
    .then( response => {
        console.log(response)
    } );

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

function test() {
    console.log("this is a test")
}

$.ajax({
    url: weatherAPI,
    method: 'GET',
  }).then(function (response) {
    console.log('Ajax Reponse \n-------------');
    console.log(response);
  });


submitBtn.on("click", function(event){
    event.preventDefault();
    subBtn = event.target;
    console.log(subBtn);

    console.log(searchResult.val());
})