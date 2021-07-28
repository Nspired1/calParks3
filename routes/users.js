const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async(req, res) =>{
   try{
        const { email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Cal Parks!');
            res.redirect('/parks');
        })
       
   } catch(err){
       req.flash('error', err.message);
       res.redirect('register');
   }
}));

// GET login form
router.get('/login', (req, res) => {
    res.render('users/login');
});

// login route
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome Back!')
    const redirectUrl = req.session.returnTo || '/parks';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

// logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Logged Out.")
    res.redirect('/parks');
})

module.exports = router; 
