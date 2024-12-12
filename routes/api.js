// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request')

// games route
router.get('/games', function (req, res, next) {

    // Query database to get all the games
    let sqlquery = "SELECT * FROM games"

    // Execute the sql query
    db.query(sqlquery, (err, result) => {
        // Return results as a JSON object
        if (err) {
            res.json(err)
            next(err)
        }
        else {
            res.json(result)
        }
    })
})

// Export the router object so index.js can access it
module.exports = router