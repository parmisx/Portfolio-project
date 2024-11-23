// const express = require("express");
// const router = express.Router();
// const request = require("request");

// // FreeToGame: Get all games
// router.get('/games', function (req, res, next) {
//     const url = 'https://www.freetogame.com/api/games';
    
//     request(url, (err, response, body) => {
//         if (err || response.statusCode !== 200) {
//             return res.send("Unable to fetch games. Please try again later.");
//         }
        
//         const games = JSON.parse(body);
//         res.render('games.ejs', { games, error: null });
//     });
// });

// // FreeToGame: Get game by ID
// router.get('/game/:id', function (req, res, next) {
//     const gameId = req.params.id;
//     const url = `https://www.freetogame.com/api/game?id=${gameId}`;
    
//     request(url, (err, response, body) => {
//         if (err || response.statusCode !== 200) {
//             return res.send("Unable to fetch game details. Please try again later.");
//         }
        
//         const game = JSON.parse(body);
//         res.render('game.ejs', { game, error: null });
//     });
// });

// // Export the router
// module.exports = router;

const express = require("express")
const router = express.Router()

router.get('/search',function(req, res, next){
    res.render("search.ejs")
})

router.get('/search_result', function (req, res, next) {
    // Search the database
    let sqlquery = "SELECT * FROM games WHERE name LIKE '%" + req.query.search_text + "%'" // query database to get all the games
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("gamelist.ejs", {availableGames:result})
     }) 
})


router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM games" // query database to get all the games
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("gamelist.ejs", {availableGames:result})
     })
})

router.get('/addgame', function (req, res, next) {
    res.render('addgame.ejs')
})

router.post('/gameadded', function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO game (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.body.name, req.body.price]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This game is added to database, name: '+ req.body.name + ' price '+ req.body.price)
    })
}) 

router.get('/bargaingames', function(req, res, next) {
    let sqlquery = "SELECT * FROM games WHERE price < 20"
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("bargains.ejs", {availableGames:result})
    })
}) 


// Export the router object so index.js can access it
module.exports = router