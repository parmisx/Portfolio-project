// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request')

// weather forecast router
router.get('/weather', function(req, res, next){
    res.render('weather.ejs', {weatherForecast: null, error: null})
})

// london now forecast router
router.get('/londonnow', function(req, res, next){
    let apiKey = 'b6a0b706d8de8df8825661aa5fb18214'
    let city = 'london'
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}` // open weather map api
    
    // error handling
    request(url, (err, response, body) => {
        if(err || response.statusCode !== 200){
            return res.send("Data not available for this city!")
        }
        const weather = JSON.parse(body)
        // respond with the weather in london
        if(weather !== undefined && weather.main !== undefined){
            const wmsg = 'It is ' + weather.main.temp + ' degrees in ' + weather.name + '! <br> The humidity now is: ' + weather.main.humidity;
            res.send(wmsg);
        } else {
            res.send("Data not available for this city!")
        }
    })
})

// forecast router for other cities
router.post('/weather', function(req, res, next){

    let apiKey = 'b6a0b706d8de8df8825661aa5fb18214'
    let city = req.body.city_search
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}` // open weather map api

    // error handling
    request(url, (err, response, body) => {
        if (err || response.statusCode !== 200) {
            return res.render('weather.ejs', { weatherForecast: null, error: "Couldn't find the city, try again." });
        }

        const weather = JSON.parse(body);
        if (weather !== undefined && weather.main !== undefined) {
            // the timezone converter
            const time = new Date(Date.now() + (weather.timezone * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            // respond with the weather in london
            const weatherForecast = {
                name: weather.name, // city name
                temp: weather.main.temp, // temperature
                humidity: weather.main.humidity, // humidity
                wind: weather.wind.speed, // wind speed
                timezoneDisplay: time // time 
            };
            res.render('weather.ejs', { weatherForecast, error: null });
        } else {
            res.render('weather.ejs', { weatherForecast: null, error: "Data not available for this city!" });
        }
    });
});

// Export the router object so index.js can access it
module.exports = router