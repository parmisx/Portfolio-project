// Create a new router
const express = require("express")
const router = express.Router()

// search route
router.get('/search',function(req, res, next){
    res.render("search.ejs")
})

// showing the search results
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

// list of games route
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

// add game route
router.get('/addgame', function (req, res, next) {
    res.render('addgame.ejs')
})

// when a game is added to the database
router.post('/gameadded', function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO games (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.body.name, req.body.price]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This game is added to database, name: '+ req.body.name + ' price '+ req.body.price) // game added to the database message
    })
}) 

// bargain games route
router.get('/bargaingames', function(req, res, next) {
    let sqlquery = "SELECT * FROM games WHERE price < 20" // display games that are under £20 in the database
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("bargain.ejs", {availableGames:result})
    })
}) 

// Export the router object so index.js can access it
module.exports = router