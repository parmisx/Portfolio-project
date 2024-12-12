// Create a new router
const express = require("express")
const router = express.Router()

// Handle our routes

// the home page route 
router.get('/',function(req, res, next){
    res.render('index.ejs')
})

// about page route
router.get('/about',function(req, res, next){
    res.render('about.ejs')
})

// user login route
const redirectLogin = (req, res, next) => {
    if(!req.session.playerId){
        res.redirect('/player/login');
    } else{
        next();
    }
}

// logout route
router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
        if(err){
            return res.redirect('./')
        }
        res.send('you are now logged out. <a href='+'./'+'>Home</a>'); // showed once logged out of account
    })
})

// Export the router object so index.js can access it
module.exports = router