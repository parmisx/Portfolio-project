// Create a new router
const express = require("express")
const router = express.Router()
const request = require("request")

// freetogame route
router.get('/games', function(req, res){
    res.render('games.ejs', { gameData: null, error: null });
});

// route to find games for different platforms in different categories
router.post('/games/search', function(req, res) {
    const { platform, category } = req.body; // search by platform and category
    const url = `https://www.freetogame.com/api/games?platform=${platform}&category=${category}`; // the link to the api of the games: www.freetogame.com

    // error handling
    request(url, (err, response, body) => {
        if (err || response.statusCode !== 200) {
            return res.render('games.ejs', { gameData: null, error: "Couldn't find the games, try again!" });
        }

        // respond with the games found
        const games = JSON.parse(body);
        if (games && games.length > 0) {
            res.render('games.ejs', { gameData: games, error: null });
        } else { // error if no results found
            res.render('games.ejs', { gameData: null, error: "No results found!" });
        }
    });
});

// Export the router object so index.js can access it
module.exports = router;
