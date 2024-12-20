// Create a new router
const express = require("express")
const router = express.Router()

const { check, validationResult } = require('express-validator');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const redirectLogin = (req, res, next) => {
    if(!req.session.playerId){
        res.redirect('./login') // redirect to the login page
    } else{
        next(); // move to the next middleware function
    }
}

// register page
router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
})    

// registered user
router.post('/registered', [
    check('email').isEmail(),
    check('password').isLength({min:8}),
    check('username').notEmpty(),
    check('firstName').notEmpty(),
    check('lastName').notEmpty()],

    function (req, res, next) {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.redirect("./register");
        } else {
            const plainPassword = req.sanitize(req.body.password);

            // hashing for password security
            bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword){
                if(err){
                    next(err);
                } else {
                // saving data in database
                let sqlquery = "INSERT INTO players (username, first_name, last_name, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";
                // execute the query
                let newPlayer = [req.sanitize(req.body.username), req.sanitize(req.body.firstName), req.sanitize(req.body.lastName), req.sanitize(req.body.email), hashedPassword];

                db.query(sqlquery, newPlayer, (err, result)=>{
                    if(err){
                        next(err);
                    } else{                                      
                        //res.send(' Hello '+ req.body.firstName + ' '+ req.body.lastName +' you are now registered!  We will send an email to you at ' + req.body.email);
                        result = 'Hello '+ req.sanitize(req.body.firstName) + ' '+ req.sanitize(req.body.lastName) +' you are now registered!  We will send an email to you at ' + req.sanitize(req.body.email)
                        result += 'Your password is: '+ req.sanitize(req.body.password) +' and your hashed password is: '+ hashedPassword
                        res.send(result)
                    }
                });
            }
        });
    }
});

// list of all the players (users)
router.get('/list', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM players" // query database to get all the players
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("playerslist.ejs", {availableGames:result})
     })
})

// login page
router.get('/login', function (req, res, next) {
    res.render('login.ejs')                                                        
})

// when loggedin 
router.post('/loggedin', 
    [check("username").notEmpty(),
    check('password').isLength({min:8})],
    function(req,res,next){
    const username = req.sanitize(req.body.username);
    const password = req.sanitize(req.body.password);

    let sqlquery = "SELECT hashedPassword FROM players WHERE username = ?"; // query database to get the hashed password with the username
    
    // execute sql query
    db.query(sqlquery, [username], (err, result) => {
        if(err){
            next(err);
        } else if(result.length == 0){ // error if username does not exist
            res.send("Login failed: User not found! please try again.");
        } else{
            // comparing the password with the hashed passwords
            const hashedPassword = result[0].hashedPassword;
            bcrypt.compare(req.sanitize(req.body.password), hashedPassword, function(err,result){
                if(err){
                    next(err);
                } else if(result == true){ // login with right username and password
                    req.session.playerId = req.sanitize(req.body.username); // save user session here, when login is successful
                    res.send(username + ", you are now logged in!"); 
                } else{ // error if password is wrong but username is right 
                    res.send("Login failed: Wrong password! please try again.")
                }
            });
        }
    });
});

// Export the router object so index.js can access it
module.exports = router
