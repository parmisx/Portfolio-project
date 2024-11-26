// Import express and ejs
var express = require ('express')
var ejs = require('ejs')

//Import mysql module
var mysql = require('mysql2')

// Create the express application object
const app = express()
const port = 8000

var session = require('express-session')

var validator = require('express-validator')

// create an input sanitizer
const expressSanitizer = require('express-sanitizer');
app.use(expressSanitizer());

// create a sessiion
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Set up public folder (for css and statis js)
app.use(express.static(__dirname + '/public'))

// Define the database connection
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'game_town_app',
    password: 'qwertyuiop',
    database: 'game_town'
})
// Connect to the database
db.connect((err) => {
    if (err) {
        throw err
    }
    console.log('Connected to database')
})
global.db = db

// Define our application-specific data
app.locals.shopData = {shopName: "Game Town"}

// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /players
const playersRoutes = require('./routes/players')
app.use('/players', playersRoutes)

// Load the route handlers for /games
const gamesRoutes = require('./routes/games')
app.use('/games', gamesRoutes)

// load the route handlers for weather
const weatherRoutes = require('./routes/weather')
app.use('/', weatherRoutes)

// load the route handlers for books api
const apiRoutes = require('./routes/api')
app.use('/api', apiRoutes)

// load the route handlers for FreeToGame API
const freetogameRoutes = require('./routes/games');
app.use('/games', freetogameRoutes);

// Start the web app listening
app.listen(port, () => console.log(`Node app listening on port ${port}!`))