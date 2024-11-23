const express = require("express");
const router = express.Router();
const request = require("request");

// FreeToGame: Get all games
router.get('/games', function (req, res, next) {
    const url = 'https://www.freetogame.com/api/games';
    
    request(url, (err, response, body) => {
        if (err || response.statusCode !== 200) {
            return res.send("Unable to fetch games. Please try again later.");
        }
        
        const games = JSON.parse(body);
        res.render('games.ejs', { games, error: null });
    });
});

// FreeToGame: Get game by ID
router.get('/game/:id', function (req, res, next) {
    const gameId = req.params.id;
    const url = `https://www.freetogame.com/api/game?id=${gameId}`;
    
    request(url, (err, response, body) => {
        if (err || response.statusCode !== 200) {
            return res.send("Unable to fetch game details. Please try again later.");
        }
        
        const game = JSON.parse(body);
        res.render('game.ejs', { game, error: null });
    });
});

// Export the router
module.exports = router;
